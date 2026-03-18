const UserController = require("./users/UsersController");
const AuthController = require("./auth/AuthController");
const UtilitiesController = require("./utilities/UtilitiesController");
const PayrollController = require("./payroll/PayrollController");
const PlanController = require("./plan/PlanController");

// New
const MerchantController = require("./merchant/MerchantController");
const PaymentController = require("./payment/PaymentController");
const SubscriptionController = require("./subscription/SubscriptionController");

module.exports = {
  UserController,
  AuthController,
  UtilitiesController,
  PayrollController,
  PlanController,
  MerchantController,
  PaymentController,
  SubscriptionController,
};
