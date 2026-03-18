const router = require("express").Router();
const SubscriptionController = require("../../controllers/subscription/SubscriptionController");
const { pagination, VerifyToken } = require("../../middlewares");
const { VerifyApiKey } = require("../../middlewares/api-key/VerifyApiKey");

// ============================================================================
// SDK Routes — API Key Auth (merchant's server)
// ============================================================================

router.get("/sdk", VerifyApiKey, pagination, SubscriptionController.listMerchantSubscriptions);
router.get("/sdk/:subscriptionId", VerifyApiKey, SubscriptionController.getSubscription);
router.post("/sdk/:subscriptionId/cancel", VerifyApiKey, SubscriptionController.merchantCancelSubscription);

// ============================================================================
// User Dashboard — JWT Auth (subscriber managing their subs)
// ============================================================================

router.get("/me", VerifyToken, pagination, SubscriptionController.getUserSubscriptions);
router.get("/me/:subscriptionId", VerifyToken, SubscriptionController.getUserSubscription);
router.post("/me/:subscriptionId/pause", VerifyToken, SubscriptionController.pauseSubscription);
router.post("/me/:subscriptionId/resume", VerifyToken, SubscriptionController.resumeSubscription);
router.post("/me/:subscriptionId/cancel", VerifyToken, SubscriptionController.cancelSubscription);
router.get("/me/:subscriptionId/charges", VerifyToken, pagination, SubscriptionController.getChargeHistory);

module.exports = router;
