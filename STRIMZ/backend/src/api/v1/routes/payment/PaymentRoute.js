const router = require("express").Router();
const PaymentController = require("../../controllers/payment/PaymentController");
const { pagination } = require("../../middlewares");
const { VerifyApiKey, VerifySessionAccess } = require("../../middlewares/api-key/VerifyApiKey");
const { body } = require("express-validator");

// ============================================================================
// SDK Routes — API Key Auth
// ============================================================================

router.post(
  "/sessions",
  VerifyApiKey,
  [
    body("type").isIn(["one_time", "subscription"]).withMessage("type must be one_time or subscription"),
    body("amount").isFloat({ gt: 0 }).withMessage("amount must be positive"),
    body("currency").optional().isIn(["USDC", "USDT"]).withMessage("currency must be USDC or USDT"),
  ],
  PaymentController.createSession
);

router.get("/sessions", VerifyApiKey, pagination, PaymentController.listSessions);
// router.get("/sessions/:sessionId", VerifyApiKey, PaymentController.getSession);
router.get("/checkout/:sessionId", PaymentController.getCheckoutSession);

router.get("/transactions", VerifyApiKey, pagination, PaymentController.listTransactions);
router.get("/transactions/:transactionId", VerifyApiKey, PaymentController.getTransaction);
router.get("/transactions/:transactionId/verify", VerifyApiKey, PaymentController.verifyTransaction);

// ============================================================================
// Checkout Routes — Session Auth (payer's browser)
// ============================================================================

router.get("/checkout/:sessionId", VerifySessionAccess, PaymentController.getCheckoutSession);

router.post(
  "/checkout/:sessionId/submitted",
  VerifySessionAccess,
  [body("transactionHash").notEmpty().withMessage("transactionHash required")],
  PaymentController.reportTransactionSubmitted
);

module.exports = router;
