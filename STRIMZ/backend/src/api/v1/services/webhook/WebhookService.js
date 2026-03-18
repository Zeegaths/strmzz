/**
 * Webhook Dispatch Service (Sequelize version)
 *
 * Sends HMAC-SHA256 signed webhook events to merchant endpoints.
 * Compatible with the SDK's verifyWebhookSignature / constructWebhookEvent.
 */

const crypto = require("crypto");
const { WebhookLogEntity } = require("../../database/classes");

class WebhookService {
  constructor() {
    this.maxRetries = 3;
    this.retryDelays = [5000, 30000, 120000]; // 5s, 30s, 2min
  }

  async dispatch(merchant, eventPayload) {
    if (!merchant.webhookUrl || !merchant.webhookSecret) return;

    const eventId = `evt_${crypto.randomBytes(16).toString("hex")}`;

    const event = {
      id: eventId,
      type: eventPayload.type,
      data: eventPayload.data,
      merchantId: merchant.onChainId || merchant.id,
      createdAt: new Date().toISOString(),
      livemode: true,
    };

    const payload = JSON.stringify(event);

    // HMAC-SHA256 — matches SDK's verifyWebhookSignature
    const signature = crypto
      .createHmac("sha256", merchant.webhookSecret)
      .update(payload)
      .digest("hex");

    await this._send(merchant, eventId, eventPayload.type, payload, signature, 0);
  }

  async _send(merchant, eventId, eventType, payload, signature, attempt) {
    // Log the attempt
    const log = await WebhookLogEntity.create({
      merchantId: merchant.id,
      url: merchant.webhookUrl,
      eventType,
      eventId,
      payload,
      signature,
      attempt: attempt + 1,
      status: "pending",
    });

    const logId = log?.id || null;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(merchant.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Strimz-Signature": signature,
          "X-Strimz-Event-Id": eventId,
          "User-Agent": "Strimz-Webhooks/1.0",
        },
        body: payload,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (logId) {
        await WebhookLogEntity.updateLog(logId, {
          statusCode: response.status,
          status: response.ok ? "delivered" : "failed",
        });
      }

      // Retry on server errors
      if (!response.ok && response.status >= 500 && attempt < this.maxRetries) {
        const delay = this.retryDelays[attempt] || 120000;
        setTimeout(() => {
          this._send(merchant, eventId, eventType, payload, signature, attempt + 1);
        }, delay);
      }
    } catch (error) {
      if (logId) {
        await WebhookLogEntity.updateLog(logId, {
          status: "failed",
          error: error.message,
        });
      }

      // Retry on network errors
      if (attempt < this.maxRetries) {
        const delay = this.retryDelays[attempt] || 120000;
        setTimeout(() => {
          this._send(merchant, eventId, eventType, payload, signature, attempt + 1);
        }, delay);
      }
    }
  }
}

module.exports = { WebhookService };
