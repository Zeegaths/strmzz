const crypto = require("crypto");
const { ApiKey, Merchant } = require("../../models");

class ApiKeyEntity {
  /**
   * Generate a key pair and store hashed versions
   * Returns raw keys ONCE — they cannot be retrieved after this
   */
  static async generateKeyPair(merchantId, environment = "live") {
    try {
      const prefix = environment === "test" ? "test" : "live";

      const publicKey = `pk_${prefix}_${crypto.randomBytes(24).toString("hex")}`;
      const secretKey = `sk_${prefix}_${crypto.randomBytes(24).toString("hex")}`;

      const publicKeyHash = crypto.createHash("sha256").update(publicKey).digest("hex");
      const secretKeyHash = crypto.createHash("sha256").update(secretKey).digest("hex");

      await ApiKey.bulkCreate([
        {
          merchantId,
          hashedKey: publicKeyHash,
          keyType: "public",
          environment: prefix,
          prefix: `pk_${prefix}_${publicKey.substring(8, 16)}`,
          active: true,
          requestCount: 0,
        },
        {
          merchantId,
          hashedKey: secretKeyHash,
          keyType: "secret",
          environment: prefix,
          prefix: `sk_${prefix}_${secretKey.substring(8, 16)}`,
          active: true,
          requestCount: 0,
        },
      ]);

      return { publicKey, secretKey, environment: prefix };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async findByHashedKey(hashedKey) {
    try {
      const result = await ApiKey.findOne({
        where: { hashedKey, active: true },
        include: [{ model: Merchant, as: "merchant" }],
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getKeysByMerchant(merchantId) {
    try {
      const keys = await ApiKey.findAll({
        where: { merchantId },
        attributes: ["id", "keyType", "environment", "prefix", "active", "lastUsedAt", "requestCount", "createdAt"],
        order: [["createdAt", "DESC"]],
      });
      return keys;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async revokeKey(keyId, merchantId) {
    try {
      const key = await ApiKey.findOne({
        where: { id: keyId, merchantId },
      });
      if (!key) return { success: false, error: "Key not found" };
      await key.update({ active: false });
      return key;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async trackUsage(keyId) {
    try {
      await ApiKey.increment("requestCount", { where: { id: keyId } });
      await ApiKey.update({ lastUsedAt: new Date() }, { where: { id: keyId } });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ApiKeyEntity;
