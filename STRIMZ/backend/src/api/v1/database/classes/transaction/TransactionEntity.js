const { Transaction, Merchant, PaymentSession } = require("../../models");
const { Op } = require("sequelize");

class TransactionEntity {
  static async createTransaction(data) {
    try {
      const tx = await Transaction.create(data);
      return tx;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getByOnChainPaymentId(onChainPaymentId) {
    try {
      const result = await Transaction.findOne({
        where: { onChainPaymentId },
        include: [{ model: Merchant, as: "merchant" }],
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getById(id) {
    try {
      const result = await Transaction.findByPk(id, {
        include: [
          { model: Merchant, as: "merchant" },
          { model: PaymentSession, as: "session" },
        ],
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getMerchantTransactions(merchantId, page = 0, size = 20, filters = {}) {
    try {
      const where = { merchantId };
      if (filters.type) where.type = filters.type;
      if (filters.status) where.status = filters.status;
      if (filters.payer) where.payer = filters.payer;

      const transactions = await Transaction.findAndCountAll({
        distinct: true,
        where,
        limit: size,
        offset: page * size,
        order: [["createdAt", "DESC"]],
      });
      return transactions;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getMerchantStats(merchantId) {
    try {
      const { sequelize } = Transaction;
      const stats = await Transaction.findOne({
        where: { merchantId, status: "completed" },
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
          [sequelize.fn("SUM", sequelize.col("amount")), "totalVolume"],
          [sequelize.fn("SUM", sequelize.col("fee")), "totalFees"],
        ],
        raw: true,
      });
      return stats;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  /**
   * Check if an on-chain payment was already indexed (deduplication)
   */
  static async existsByOnChainPaymentId(onChainPaymentId) {
    try {
      const count = await Transaction.count({ where: { onChainPaymentId } });
      return count > 0;
    } catch (error) {
      return false;
    }
  }
}

module.exports = TransactionEntity;
