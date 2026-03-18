const router = require("express").Router();
const MerchantController = require("../../controllers/merchant/MerchantController");
const { pagination, VerifyToken, verifyAdmin } = require("../../middlewares");
const { body } = require("express-validator");

// ============================================================================
// Merchant Dashboard (JWT auth)
// ============================================================================

router.post(
  "/register",
  VerifyToken,
  [
    body("walletAddress").notEmpty().withMessage("walletAddress required"),
    body("name").notEmpty().withMessage("name required"),
    body("businessEmail").isEmail().withMessage("valid businessEmail required"),
  ],
  MerchantController.registerMerchant
);

router.get("/me", VerifyToken, MerchantController.getOwnMerchant);
router.put("/me", VerifyToken, MerchantController.updateMerchant);
router.put(
  "/me/wallet",
  VerifyToken,
  [body("walletAddress").notEmpty().withMessage("walletAddress required")],
  MerchantController.updateWallet
);
router.put(
  "/me/webhooks",
  VerifyToken,
  [body("webhookUrl").isURL().withMessage("valid URL required")],
  MerchantController.updateWebhookConfig
);

router.post("/me/api-keys", VerifyToken, MerchantController.generateApiKeys);
router.get("/me/api-keys", VerifyToken, MerchantController.listApiKeys);
router.delete("/me/api-keys/:keyId", VerifyToken, MerchantController.revokeApiKey);

router.get("/me/stats", VerifyToken, MerchantController.getDashboardStats);
router.get("/me/transactions", VerifyToken, pagination, MerchantController.getTransactions);
router.get("/me/subscriptions", VerifyToken, pagination, MerchantController.getSubscriptions);
router.get("/me/customers", VerifyToken, pagination, MerchantController.getCustomers);

// ============================================================================
// Admin
// ============================================================================

router.get("/", VerifyToken, verifyAdmin, pagination, MerchantController.getAllMerchants);
router.get("/:merchantId", VerifyToken, verifyAdmin, MerchantController.getMerchantById);
router.put("/:merchantId/status", VerifyToken, verifyAdmin, MerchantController.updateMerchantStatus);
router.put(
  "/:merchantId/fee",
  VerifyToken,
  verifyAdmin,
  [body("feeBps").isInt({ min: 0, max: 500 }).withMessage("feeBps must be 0-500")],
  MerchantController.setCustomFee
);

module.exports = router;
