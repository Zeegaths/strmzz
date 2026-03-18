const { Merchant, User, ApiKey } = require("../../models");

class MerchantEntity {
  static async createMerchant(data) {
    try {
      const newMerchant = await Merchant.create(data);
      return newMerchant;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getMerchantById(id) {
    try {
      const result = await Merchant.findOne({
        where: { id },
        include: [{ model: User, as: "owner" }],
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getMerchantByUserId(userId) {
    try {
      const result = await Merchant.findOne({
        where: { userId },
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getMerchantByOnChainId(onChainId) {
    try {
      const result = await Merchant.findOne({
        where: { onChainId },
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getMerchantByWallet(walletAddress) {
    try {
      const result = await Merchant.findOne({
        where: { walletAddress },
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async updateMerchant(id, data) {
    try {
      const merchant = await Merchant.findByPk(id);
      if (!merchant) return { success: false, error: "Merchant not found" };
      await merchant.update(data);
      return merchant;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getAllMerchants(page = 0, size = 100) {
    try {
      const merchants = await Merchant.findAndCountAll({
        distinct: true,
        include: [{ model: User, as: "owner" }],
        limit: size,
        offset: page * size,
        order: [["createdAt", "DESC"]],
      });
      return merchants;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }
}

module.exports = MerchantEntity;
