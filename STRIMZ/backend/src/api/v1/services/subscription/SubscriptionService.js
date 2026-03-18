const { CheckDBResponse } = require("../../helpers");
const {
  SubscriptionEntity,
  MerchantEntity,
} = require("../../database/classes");

exports.getSubscription = async (subscriptionId, merchantId) => {
  try {
    const sub = await SubscriptionEntity.getById(subscriptionId);
    if (!sub || sub.merchantId !== merchantId) {
      return CheckDBResponse.errorResponse("Subscription not found");
    }
    return CheckDBResponse.successResponse(sub);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.listMerchantSubscriptions = async (merchantId, page, size, filters) => {
  try {
    const subs = await SubscriptionEntity.getMerchantSubscriptions(
      merchantId,
      page,
      size,
      filters
    );
    return CheckDBResponse.response(subs);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.getUserSubscriptions = async (walletAddress, page, size) => {
  try {
    if (!walletAddress) {
      return CheckDBResponse.errorResponse("Wallet address required");
    }
    const subs = await SubscriptionEntity.getUserSubscriptions(
      walletAddress,
      page,
      size
    );
    return CheckDBResponse.response(subs);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.getUserSubscription = async (subscriptionId, walletAddress) => {
  try {
    const sub = await SubscriptionEntity.getById(subscriptionId);
    if (!sub || sub.subscriber !== walletAddress) {
      return CheckDBResponse.errorResponse("Subscription not found");
    }
    return CheckDBResponse.successResponse(sub);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

/**
 * These status changes are tracked off-chain in the DB.
 * The actual on-chain state change happens from the frontend
 * calling the contract directly. The indexer will pick up
 * the SubscriptionStatusChanged event and sync it here.
 *
 * But we also update locally for immediate UI feedback.
 */

exports.pauseSubscription = async (subscriptionId, walletAddress) => {
  try {
    const sub = await SubscriptionEntity.getById(subscriptionId);
    if (!sub || sub.subscriber !== walletAddress) {
      return CheckDBResponse.errorResponse("Subscription not found");
    }
    if (sub.status !== "active") {
      return CheckDBResponse.errorResponse("Subscription is not active");
    }

    const updated = await SubscriptionEntity.updateByOnChainId(
      sub.onChainSubscriptionId,
      { status: "paused" }
    );
    return CheckDBResponse.successResponse(updated);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.resumeSubscription = async (subscriptionId, walletAddress) => {
  try {
    const sub = await SubscriptionEntity.getById(subscriptionId);
    if (!sub || sub.subscriber !== walletAddress) {
      return CheckDBResponse.errorResponse("Subscription not found");
    }
    if (sub.status !== "paused") {
      return CheckDBResponse.errorResponse("Subscription is not paused");
    }

    const updated = await SubscriptionEntity.updateByOnChainId(
      sub.onChainSubscriptionId,
      { status: "active" }
    );
    return CheckDBResponse.successResponse(updated);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.cancelSubscription = async (subscriptionId, walletAddress) => {
  try {
    const sub = await SubscriptionEntity.getById(subscriptionId);
    if (!sub || sub.subscriber !== walletAddress) {
      return CheckDBResponse.errorResponse("Subscription not found");
    }

    const updated = await SubscriptionEntity.updateByOnChainId(
      sub.onChainSubscriptionId,
      { status: "cancelled" }
    );
    return CheckDBResponse.successResponse(updated);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.merchantCancelSubscription = async (subscriptionId, merchantId) => {
  try {
    const sub = await SubscriptionEntity.getById(subscriptionId);
    if (!sub || sub.merchantId !== merchantId) {
      return CheckDBResponse.errorResponse("Subscription not found");
    }

    const updated = await SubscriptionEntity.updateByOnChainId(
      sub.onChainSubscriptionId,
      { status: "cancelled" }
    );
    return CheckDBResponse.successResponse(updated);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.getChargeHistory = async (subscriptionId, walletAddress, page, size) => {
  try {
    const sub = await SubscriptionEntity.getById(subscriptionId);
    if (!sub || sub.subscriber !== walletAddress) {
      return CheckDBResponse.errorResponse("Subscription not found");
    }

    const { TransactionEntity } = require("../../database/classes");
    const { Transaction } = require("../../database/models");
    const charges = await Transaction.findAndCountAll({
      where: {
        subscriptionId: sub.onChainSubscriptionId,
        merchantId: sub.merchantId,
      },
      limit: size,
      offset: page * size,
      order: [["createdAt", "DESC"]],
    });

    return CheckDBResponse.response(charges);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};
