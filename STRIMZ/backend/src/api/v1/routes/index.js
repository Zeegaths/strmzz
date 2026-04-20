const router = require("express").Router();

// Existing routes
const AuthRoute = require("./auth/AuthRoute");
const UserRoute = require("./user/UserRoute");
const UtilitiesRoute = require("./utilities/UtilitiesRoute");
const PayrollRoute = require("./payroll/PayrollRoute");
const PlanRoute = require("./plan/PlanRoute");

// New payment platform routes
const MerchantRoute = require("./merchant/MerchantRoute");
const PaymentRoute = require("./payment/PaymentRoute");
const SubscriptionRoute = require("./subscription/SubscriptionRoute");
const WebhookRoute = require("./webhook/WebhookRoute");

// Existing
router.use("/auth", AuthRoute);
router.use("/users", UserRoute);
router.use("/utilities", UtilitiesRoute);
router.use("/payroll", PayrollRoute);
router.use("/plan", PlanRoute);

// New
router.use("/merchants", MerchantRoute);
router.use("/payments", PaymentRoute);
router.use("/subscriptions", SubscriptionRoute);
router.use("/webhooks", WebhookRoute);

module.exports = router;
