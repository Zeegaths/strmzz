const UsersService = require("./users/UsersService");
const AuthService = require("./auth/AuthService");
const UtilitiesService = require("./utilities/UtilitiesService");
const PayrollService = require("./payroll/PayrollService");
const PlanService = require("./plan/PlanService");

// New
const MerchantService = require("./merchant/MerchantService");
const PaymentService = require("./payment/PaymentService");
const SubscriptionService = require("./subscription/SubscriptionService");

module.exports = {
  UsersService,
  AuthService,
  UtilitiesService,
  PayrollService,
  PlanService,
  MerchantService,
  PaymentService,
  SubscriptionService,
};
