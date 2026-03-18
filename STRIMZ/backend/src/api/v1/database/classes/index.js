const User = require("./user/UserEntity");
const Token = require("./auth/TokenEntity");
const Payroll = require("./payroll/PayrollEntity");
const Plan = require("./plan/PlanEntity");

// New payment platform entities
const MerchantEntity = require("./merchant/MerchantEntity");
const ApiKeyEntity = require("./apikey/ApiKeyEntity");
const PaymentSessionEntity = require("./payment/PaymentSessionEntity");
const TransactionEntity = require("./transaction/TransactionEntity");
const SubscriptionEntity = require("./subscription/SubscriptionEntity");
const WebhookLogEntity = require("./webhook/WebhookLogEntity");
const IndexerStateEntity = require("./indexer/IndexerStateEntity");

module.exports = {
  // Existing
  User,
  Token,
  Payroll,
  Plan,

  // New
  MerchantEntity,
  ApiKeyEntity,
  PaymentSessionEntity,
  TransactionEntity,
  SubscriptionEntity,
  WebhookLogEntity,
  IndexerStateEntity,
};
