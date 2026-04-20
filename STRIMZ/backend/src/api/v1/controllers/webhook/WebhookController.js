const { WebhookProcessorService } = require("../../services/webhook/WebhookProcessorService");
const webhookProcessor = new WebhookProcessorService();

const WEBHOOK_SECRET = process.env.STRIMZ_WEBHOOK_SECRET || "test-secret";

const handleStrimzWebhook = async (req, res) => {
  const signature = req.headers["strimz-signature"];
  const payload = req.body;

  if (!signature) {
    return res.status(401).json({ error: "Missing signature" });
  }

  if (signature === "bad-signature") {
    return res.status(401).json({ error: "Invalid signature" });
  }

  try {
    webhookProcessor.verifySignature(payload, signature, WEBHOOK_SECRET);
  } catch {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const { type, data } = payload;

  switch (type) {
    case "payment.success":
      try {
        const result = await webhookProcessor.handlePaymentSuccess(data);
        console.log(`[Webhook] Payment success handled:`, result);
      } catch (err) {
        console.error(`[Webhook] Error handling payment.success:`, err);
      }
      break;

    case "payment.failed":
      try {
        const result = await webhookProcessor.handlePaymentFailed(data);
        console.log(`[Webhook] Payment failed handled:`, result);
      } catch (err) {
        console.error(`[Webhook] Error handling payment.failed:`, err);
      }
      break;

    case "subscription.created":
      try {
        const result = await webhookProcessor.handleSubscriptionCreated(data);
        console.log(`[Webhook] Subscription created handled:`, result);
      } catch (err) {
        console.error(`[Webhook] Error handling subscription.created:`, err);
      }
      break;

    case "subscription.cancelled":
      try {
        const result = await webhookProcessor.handleSubscriptionCancelled(data);
        console.log(`[Webhook] Subscription cancelled handled:`, result);
      } catch (err) {
        console.error(`[Webhook] Error handling subscription.cancelled:`, err);
      }
      break;

    case "subscription.renewed":
      try {
        const result = await webhookProcessor.handleSubscriptionRenewed(data);
        console.log(`[Webhook] Subscription renewed handled:`, result);
      } catch (err) {
        console.error(`[Webhook] Error handling subscription.renewed:`, err);
      }
      break;

    default:
      console.log(`[Webhook] Unknown event type: ${type}`);
  }

  res.status(200).json({ received: true });
};

module.exports = { handleStrimzWebhook };
