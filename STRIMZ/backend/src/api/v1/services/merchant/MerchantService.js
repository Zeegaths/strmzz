const { CheckDBResponse } = require("../../helpers");
const {
  MerchantEntity,
  ApiKeyEntity,
} = require("../../database/classes");
const crypto = require("crypto");
const { ethers } = require("ethers");

// ============================================================================
// On-chain merchant registration
// ============================================================================

const STRIMZ_ABI = [
  "function registerMerchantFor(address wallet, string name) external returns (bytes32)",
  "event MerchantRegistered(bytes32 indexed merchantId, address indexed wallet, string name)",
];

async function registerMerchantOnChain(walletAddress, name) {
  try {
    const rpcUrl = process.env.BASE_RPC_URL;
    const contractAddress = process.env.STRIMZ_CONTRACT_ADDRESS;
    const privateKey = process.env.CHARGER_PRIVATE_KEY;

    if (!rpcUrl || !contractAddress || !privateKey || contractAddress.length !== 42) {
      console.log("[OnChain] Skipping on-chain registration — env not configured");
      return null;
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, STRIMZ_ABI, wallet);

    console.log(`[OnChain] Registering merchant ${name} (${walletAddress})...`);

    const tx = await contract.registerMerchantFor(walletAddress, name);
    const receipt = await tx.wait();

    // Extract merchantId from event logs
    const iface = new ethers.Interface(STRIMZ_ABI);
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog({ topics: log.topics, data: log.data });
        if (parsed && parsed.name === "MerchantRegistered") {
          const merchantId = parsed.args[0]; // bytes32 merchantId
          console.log(`[OnChain] Merchant registered: ${merchantId}`);
          return merchantId;
        }
      } catch (e) {
        // Not our event, skip
      }
    }

    console.log("[OnChain] Registration tx confirmed but no event found");
    return null;
  } catch (error) {
    console.error("[OnChain] Registration failed:", error.message);
    // Don't block the signup — on-chain registration is a nice-to-have
    // Merchant can still use the dashboard, just can't receive payments until registered
    return null;
  }
}

// ============================================================================
// Service Methods
// ============================================================================

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

    // Register on-chain (async — don't block signup if it fails)
    const onChainId = await registerMerchantOnChain(data.walletAddress, data.name);
    if (onChainId) {
      await MerchantEntity.updateMerchant(merchant.id, { onChainId });
      merchant.onChainId = onChainId;
    }

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
      onChainRegistered: !!onChainId,
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
    // Include webhookSecret for owner
    const data = { ...merchant.toJSON() };
    try { data.webhookSecret = merchant.dataValues.webhookSecret; } catch(e) {}
    return CheckDBResponse.successResponse(data);
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
    const updated = await MerchantEntity.updateMerchant(merchant.id, data);
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

    // Check not taken
    const exists = await MerchantEntity.getMerchantByWallet(walletAddress);
    if (exists && exists.id !== merchant.id) {
      return CheckDBResponse.errorResponse("Wallet address already registered");
    }

    const updated = await MerchantEntity.updateMerchant(merchant.id, { walletAddress });
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
    const updated = await MerchantEntity.updateMerchant(merchant.id, { webhookUrl });
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
    await ApiKeyEntity.revokeKey(keyId, merchant.id);
    return CheckDBResponse.successResponse({ revoked: true });
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
    const { TransactionEntity } = require("../../database/classes");
    const txStats = await TransactionEntity.getMerchantStats(merchant.id);
    const { Subscription } = require("../../database/models");
    const activeSubs = await Subscription.count({
      where: { merchantId: merchant.id, status: "active" },
    });
    return CheckDBResponse.successResponse({
      ...(txStats || {}),
      activeSubscriptions: activeSubs,
      merchantId: merchant.id,
      onChainId: merchant.onChainId,
    });
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.getAllMerchants = async (page, size) => {
  try {
    const result = await MerchantEntity.getAllMerchants(page, size);
    return CheckDBResponse.successResponse(result);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.setCustomFee = async (merchantId, feeBps) => {
  try {
    const updated = await MerchantEntity.updateMerchant(merchantId, {
      customFeeBps: feeBps,
    });
    return CheckDBResponse.successResponse(updated);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};