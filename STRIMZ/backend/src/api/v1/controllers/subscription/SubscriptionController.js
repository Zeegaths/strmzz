const SubscriptionService = require("../../services/subscription/SubscriptionService");
const { MessageResponse } = require("../../helpers");

// ============================================================================
// SDK Routes (API Key auth)
// ============================================================================

exports.getSubscription = async (req, res, next) => {
  try {
    const result = await SubscriptionService.getSubscription(
      req.params.subscriptionId,
      req.merchant.id
    );
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Subscription found", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Not found", 404, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.listMerchantSubscriptions = async (req, res, next) => {
  try {
    const { page, size } = req.pagination;
    const result = await SubscriptionService.listMerchantSubscriptions(
      req.merchant.id,
      page,
      size,
      req.query
    );
    return MessageResponse.successResponse(res, "Subscriptions", 200, result.data);
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.merchantCancelSubscription = async (req, res, next) => {
  try {
    const result = await SubscriptionService.merchantCancelSubscription(
      req.params.subscriptionId,
      req.merchant.id
    );
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Subscription cancelled", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Cancel failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

// ============================================================================
// User Dashboard Routes (JWT auth)
// ============================================================================

exports.getUserSubscriptions = async (req, res, next) => {
  try {
    const { page, size } = req.pagination;
    // req.user.uid is the userId — we need their wallet address
    const { User } = require("../../database/classes");
    const user = await User.getUserById(req.user.uid);
    if (!user || !user.address) {
      return MessageResponse.errorResponse(res, "No wallet found", 400, "Link a wallet first");
    }

    const result = await SubscriptionService.getUserSubscriptions(
      user.address,
      page,
      size
    );
    return MessageResponse.successResponse(res, "Subscriptions", 200, result.data);
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.getUserSubscription = async (req, res, next) => {
  try {
    const { User } = require("../../database/classes");
    const user = await User.getUserById(req.user.uid);
    if (!user || !user.address) {
      return MessageResponse.errorResponse(res, "No wallet found", 400, "Link a wallet first");
    }

    const result = await SubscriptionService.getUserSubscription(
      req.params.subscriptionId,
      user.address
    );
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Subscription found", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Not found", 404, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.pauseSubscription = async (req, res, next) => {
  try {
    const { User } = require("../../database/classes");
    const user = await User.getUserById(req.user.uid);

    const result = await SubscriptionService.pauseSubscription(
      req.params.subscriptionId,
      user.address
    );
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Subscription paused", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Pause failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.resumeSubscription = async (req, res, next) => {
  try {
    const { User } = require("../../database/classes");
    const user = await User.getUserById(req.user.uid);

    const result = await SubscriptionService.resumeSubscription(
      req.params.subscriptionId,
      user.address
    );
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Subscription resumed", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Resume failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    const { User } = require("../../database/classes");
    const user = await User.getUserById(req.user.uid);

    const result = await SubscriptionService.cancelSubscription(
      req.params.subscriptionId,
      user.address
    );
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Subscription cancelled", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Cancel failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.getChargeHistory = async (req, res, next) => {
  try {
    const { User } = require("../../database/classes");
    const user = await User.getUserById(req.user.uid);
    const { page, size } = req.pagination;

    const result = await SubscriptionService.getChargeHistory(
      req.params.subscriptionId,
      user.address,
      page,
      size
    );
    return MessageResponse.successResponse(res, "Charge history", 200, result.data);
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};