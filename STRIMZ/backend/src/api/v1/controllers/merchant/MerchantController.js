const MerchantService = require("../../services/merchant/MerchantService");
const { CheckBadRequest } = require("../../validations");
const { MessageResponse } = require("../../helpers");

exports.registerMerchant = async (req, res, next) => {
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);

  try {
    const result = await MerchantService.registerMerchant(req.user.uid, req.body);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Merchant registered", 201, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Registration failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.getOwnMerchant = async (req, res, next) => {
  try {
    const result = await MerchantService.getOwnMerchant(req.user.uid);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Merchant found", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Not found", 404, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.updateMerchant = async (req, res, next) => {
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);

  try {
    const result = await MerchantService.updateMerchant(req.user.uid, req.body);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Merchant updated", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Update failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.updateWallet = async (req, res, next) => {
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);

  try {
    const result = await MerchantService.updateWallet(req.user.uid, req.body.walletAddress);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Wallet updated", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Update failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.updateWebhookConfig = async (req, res, next) => {
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);

  try {
    const result = await MerchantService.updateWebhookConfig(req.user.uid, req.body.webhookUrl);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Webhook updated", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Update failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.generateApiKeys = async (req, res, next) => {
  try {
    const environment = req.body.environment || "live";
    const result = await MerchantService.generateApiKeys(req.user.uid, environment);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "API keys generated", 201, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Generation failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.listApiKeys = async (req, res, next) => {
  try {
    const result = await MerchantService.listApiKeys(req.user.uid);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "API keys", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Not found", 404, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.revokeApiKey = async (req, res, next) => {
  try {
    const result = await MerchantService.revokeApiKey(req.user.uid, req.params.keyId);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "API key revoked", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Revoke failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const result = await MerchantService.getDashboardStats(req.user.uid);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Dashboard stats", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Not found", 404, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

// Proxy to PaymentService / SubscriptionService for dashboard routes
exports.getTransactions = async (req, res, next) => {
  try {
    const MerchantServiceLocal = require("../../services/merchant/MerchantService");
    const merchant = await MerchantServiceLocal.getOwnMerchant(req.user.uid);
    if (!merchant.success) {
      return MessageResponse.errorResponse(res, "Not found", 404, "Merchant not found");
    }

    const PaymentService = require("../../services/payment/PaymentService");
    const { page, size } = req.pagination;
    const result = await PaymentService.listTransactions(merchant.data.id, page, size, req.query);
    return MessageResponse.successResponse(res, "Transactions", 200, result.data);
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.getSubscriptions = async (req, res, next) => {
  try {
    const MerchantServiceLocal = require("../../services/merchant/MerchantService");
    const merchant = await MerchantServiceLocal.getOwnMerchant(req.user.uid);
    if (!merchant.success) {
      return MessageResponse.errorResponse(res, "Not found", 404, "Merchant not found");
    }

    const SubscriptionService = require("../../services/subscription/SubscriptionService");
    const { page, size } = req.pagination;
    const result = await SubscriptionService.listMerchantSubscriptions(
      merchant.data.id, page, size, req.query
    );
    return MessageResponse.successResponse(res, "Subscriptions", 200, result.data);
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
    const MerchantServiceLocal = require("../../services/merchant/MerchantService");
    const merchant = await MerchantServiceLocal.getOwnMerchant(req.user.uid);
    if (!merchant.success) {
      return MessageResponse.errorResponse(res, "Not found", 404, "Merchant not found");
    }

    // Get unique payers from transactions
    const { Transaction } = require("../../database/models");
    const { sequelize } = Transaction;
    const { page, size } = req.pagination;

    const customers = await Transaction.findAll({
      where: { merchantId: merchant.data.id },
      attributes: [
        "payer",
        [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalSpent"],
        [sequelize.fn("MAX", sequelize.col("createdAt")), "lastTransaction"],
      ],
      group: ["payer"],
      order: [[sequelize.fn("SUM", sequelize.col("amount")), "DESC"]],
      limit: size,
      offset: page * size,
      raw: true,
    });

    return MessageResponse.successResponse(res, "Customers", 200, customers);
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

// Admin
exports.getAllMerchants = async (req, res, next) => {
  try {
    const { page, size } = req.pagination;
    const result = await MerchantService.getAllMerchants(page, size);
    return MessageResponse.successResponse(res, "All merchants", 200, result.data);
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.getMerchantById = async (req, res, next) => {
  try {
    const { MerchantEntity } = require("../../database/classes");
    const merchant = await MerchantEntity.getMerchantById(req.params.merchantId);
    if (!merchant) {
      return MessageResponse.errorResponse(res, "Not found", 404, "Merchant not found");
    }
    return MessageResponse.successResponse(res, "Merchant", 200, merchant);
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.updateMerchantStatus = async (req, res, next) => {
  try {
    const { MerchantEntity } = require("../../database/classes");
    const updated = await MerchantEntity.updateMerchant(req.params.merchantId, {
      active: req.body.active,
    });
    return MessageResponse.successResponse(res, "Status updated", 200, updated);
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.setCustomFee = async (req, res, next) => {
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);

  try {
    const result = await MerchantService.setCustomFee(req.params.merchantId, req.body.feeBps);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Fee updated", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Update failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};