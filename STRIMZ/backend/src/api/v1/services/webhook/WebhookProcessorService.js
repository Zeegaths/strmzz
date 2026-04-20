const crypto = require("crypto");
const { UtilitiesService } = require("../../services");
const {
  sendPaymentConfirmation,
  sendBillConfirmation,
  sendBillFailedNotification,
  sendPaymentFailedNotification,
  sendSubscriptionWelcome,
  sendSubscriptionCancelled,
  sendSubscriptionRenewed,
} = require("../../helpers/email/EmailTemplates");

class WebhookProcessorService {
  async fulfillBill(preference, paymentId) {
    const { type, provider, phone, email, amount, variation_code, billersCode } = preference;

    const payload = {
      serviceID: provider,
      phone: phone,
      billersCode: billersCode || phone,
      variation_code: variation_code,
    };

    if (type === "airtime") {
      payload.amount = amount;
    }

    try {
      const result = await UtilitiesService.purchase(payload);
      return result;
    } catch (error) {
      console.error(`[Webhook] Bill fulfillment error:`, error);
      throw error;
    }
  }

  async handlePaymentSuccess(data) {
    const payment = data.payment;
    console.log(`[Webhook] Processing payment.success:`, payment.id);

    if (payment.preference) {
      try {
        const preference = JSON.parse(payment.preference);
        console.log(`[Webhook] Fulfilling bill: ${preference.type}`);
        const result = await this.fulfillBill(preference, payment.id);
        console.log(`[Webhook] Bill fulfilled:`, result);

        await sendBillConfirmation(payment.customerEmail, {
          type: preference.type,
          provider: preference.provider || preference.type.toUpperCase(),
          amount: payment.amount,
          phone: preference.phone,
          reference: result?.data?.request_id || payment.id,
        });

        return { type: "bill", result };
      } catch (err) {
        console.error(`[Webhook] Bill fulfillment failed:`, err);

        await sendBillFailedNotification(payment.customerEmail, {
          type: preference.type,
          provider: preference.provider,
          phone: preference.phone,
        }, err.message);

        return { type: "bill", error: err.message };
      }
    }

    await sendPaymentConfirmation(payment.customerEmail, {
      id: payment.id,
      amount: payment.amount,
    });

    return { type: "payment", granted: true };
  }

  async handlePaymentFailed(data) {
    const payment = data.payment;
    console.log(`[Webhook] Processing payment.failed:`, payment.id);

    await sendPaymentFailedNotification(payment.customerEmail, {
      id: payment.id,
    });

    return { notified: true };
  }

  async handleSubscriptionCreated(data) {
    const subscription = data.subscription;
    console.log(`[Webhook] Processing subscription.created:`, subscription.id);

    await sendSubscriptionWelcome(subscription.customerEmail, {
      id: subscription.id,
      interval: subscription.interval,
      amount: subscription.amount,
    });

    return { granted: true, notified: true };
  }

  async handleSubscriptionCancelled(data) {
    const subscription = data.subscription;
    console.log(`[Webhook] Processing subscription.cancelled:`, subscription.id);

    await sendSubscriptionCancelled(subscription.customerEmail, {
      id: subscription.id,
    });

    return { revoked: true, notified: true };
  }

  async handleSubscriptionRenewed(data) {
    const subscription = data.subscription;
    console.log(`[Webhook] Processing subscription.renewed:`, subscription.id);

    await sendSubscriptionRenewed(subscription.customerEmail, {
      id: subscription.id,
      nextBillingDate: subscription.nextBillingDate,
    });

    return { extended: true, notified: true };
  }

  processVTPassWebhook(payload) {
    const { type, data } = payload;
    const { payment } = data;

    if (!payment) {
      return { success: false, error: "Missing payment data" };
    }

    const preference = payment.preference ? JSON.parse(payment.preference) : {};

    const transactionData = {
      externalId: payment.id,
      amount: parseFloat(payment.amount),
      currency: "USD",
      customerEmail: payment.customerEmail,
      provider: preference.type === "airtime" ? "VTPass" : "VTPass",
      serviceType: preference.type,
      providerReference: payment.reference || payment.id,
      status: type === "payment.success" ? "completed" : "failed",
      metadata: {
        preference,
        originalPayload: data,
      },
    };

    return { success: true, data: transactionData };
  }

  processReloadlyWebhook(payload) {
    const { type, data } = payload;
    const { payment } = data;

    if (!payment) {
      return { success: false, error: "Missing payment data" };
    }

    const preference = payment.preference ? JSON.parse(payment.preference) : {};

    return {
      success: true,
      data: {
        externalId: payment.id,
        amount: parseFloat(payment.amount),
        currency: "USD",
        customerEmail: payment.customerEmail,
        provider: "Reloadly",
        serviceType: preference.type,
        providerReference: payment.reference || payment.id,
        status: type === "payment.success" ? "completed" : "failed",
        metadata: {
          preference,
          originalPayload: data,
        },
      },
    };
  }

  verifySignature(payload, signature, secret) {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(payload))
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(signature || ""),
      Buffer.from(expectedSignature)
    );
  }
}

module.exports = { WebhookProcessorService };
