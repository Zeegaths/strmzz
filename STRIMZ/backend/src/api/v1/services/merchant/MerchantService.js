const { CheckDBResponse } = require("../../helpers");
const {
  MerchantEntity,
  ApiKeyEntity,
} = require("../../database/classes");
const crypto = require("crypto");

exports.registerMerchant = async (userId, data) => {
  try {
    // Check if user already has a merchant account
    const existing = await MerchantEntity.getMerchantByUserId(userId);
    if (existing) {
      return CheckDBResponse.errorResponse("User already has a merchant account");
    }

    // Check wallet not already registered
    const walletExists = await MerchantEntity.getMerchantByWallet(data.walletAddress);
    if (walletExists) {
      return CheckDBResponse.errorResponse("Wallet address already registered");
    }

    // Generate webhook secret
    const webhookSecret = `whsec_${crypto.randomBytes(24).toString("hex")}`;

    const merchant = await MerchantEntity.createMerchant({
      userId,
      walletAddress: data.walletAddress,
      name: data.name,
      businessEmail: data.businessEmail,
      webhookUrl: data.webhookUrl || null,
      webhookSecret,
      redirectUrl: data.redirectUrl || null,
      metadata: data.metadata || null,
    });

    // Generate initial API key pair
    const keys = await ApiKeyEntity.generateKeyPair(merchant.id, "live");
    const testKeys = await ApiKeyEntity.generateKeyPair(merchant.id, "test");

    return CheckDBResponse.successResponse({
      merchant: merchant.toJSON(),
      keys: {
        live: keys,
        test: testKeys,
      },
      webhookSecret,
    });
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.getOwnMerchant = async (userId) => {
  try {
    const merchant = await MerchantEntity.getMerchantByUserId(userId);
    if (!merchant) {
      return CheckDBResponse.errorResponse("Merchant account not found");
    }
    return CheckDBResponse.successResponse(merchant);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.updateMerchant = async (userId, data) => {
  try {
    const merchant = await MerchantEntity.getMerchantByUserId(userId);
    if (!merchant) {
      return CheckDBResponse.errorResponse("Merchant account not found");
    }

    const updated = await MerchantEntity.updateMerchant(merchant.id, {
      name: data.name,
      businessEmail: data.businessEmail,
      redirectUrl: data.redirectUrl,
    });

    return CheckDBResponse.successResponse(updated);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.updateWallet = async (userId, walletAddress) => {
  try {
    const merchant = await MerchantEntity.getMerchantByUserId(userId);
    if (!merchant) {
      return CheckDBResponse.errorResponse("Merchant account not found");
    }

    const updated = await MerchantEntity.updateMerchant(merchant.id, {
      walletAddress,
    });

    return CheckDBResponse.successResponse(updated);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.updateWebhookConfig = async (userId, webhookUrl) => {
  try {
    const merchant = await MerchantEntity.getMerchantByUserId(userId);
    if (!merchant) {
      return CheckDBResponse.errorResponse("Merchant account not found");
    }

    const updated = await MerchantEntity.updateMerchant(merchant.id, {
      webhookUrl,
    });

    return CheckDBResponse.successResponse(updated);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.generateApiKeys = async (userId, environment = "live") => {
  try {
    const merchant = await MerchantEntity.getMerchantByUserId(userId);
    if (!merchant) {
      return CheckDBResponse.errorResponse("Merchant account not found");
    }

    const keys = await ApiKeyEntity.generateKeyPair(merchant.id, environment);
    return CheckDBResponse.successResponse(keys);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.listApiKeys = async (userId) => {
  try {
    const merchant = await MerchantEntity.getMerchantByUserId(userId);
    if (!merchant) {
      return CheckDBResponse.errorResponse("Merchant account not found");
    }

    const keys = await ApiKeyEntity.getKeysByMerchant(merchant.id);
    return CheckDBResponse.successResponse(keys);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.revokeApiKey = async (userId, keyId) => {
  try {
    const merchant = await MerchantEntity.getMerchantByUserId(userId);
    if (!merchant) {
      return CheckDBResponse.errorResponse("Merchant account not found");
    }

    const result = await ApiKeyEntity.revokeKey(keyId, merchant.id);
    if (result.success === false) {
      return CheckDBResponse.errorResponse(result.error);
    }
    return CheckDBResponse.successResponse(result);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.getDashboardStats = async (userId) => {
  try {
    const merchant = await MerchantEntity.getMerchantByUserId(userId);
    if (!merchant) {
      return CheckDBResponse.errorResponse("Merchant account not found");
    }

    const { TransactionEntity, SubscriptionEntity } = require("../../database/classes");

    const txStats = await TransactionEntity.getMerchantStats(merchant.id);
    const { Subscription } = require("../../database/models");
    const activeSubs = await Subscription.count({
      where: { merchantId: merchant.id, status: "active" },
    });

    return CheckDBResponse.successResponse({
      totalTransactions: Number(txStats?.totalTransactions || 0),
      totalVolume: Number(txStats?.totalVolume || 0),
      totalFees: Number(txStats?.totalFees || 0),
      activeSubscriptions: activeSubs,
    });
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

// Admin functions
exports.getAllMerchants = async (page, size) => {
  try {
    const merchants = await MerchantEntity.getAllMerchants(page, size);
    return CheckDBResponse.response(merchants);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.setCustomFee = async (merchantId, feeBps) => {
  try {
    if (feeBps > 500) {
      return CheckDBResponse.errorResponse("Fee cannot exceed 5% (500 bps)");
    }
    const updated = await MerchantEntity.updateMerchant(merchantId, {
      customFeeBps: feeBps,
    });
    return CheckDBResponse.successResponse(updated);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};
