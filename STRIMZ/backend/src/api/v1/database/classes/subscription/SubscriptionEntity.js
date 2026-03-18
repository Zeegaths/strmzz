const { Subscription, Merchant } = require("../../models");
const { Op } = require("sequelize");

class SubscriptionEntity {
  static async createSubscription(data) {
    try {
      const sub = await Subscription.create(data);
      return sub;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getByOnChainId(onChainSubscriptionId) {
    try {
      const result = await Subscription.findOne({
        where: { onChainSubscriptionId },
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
      const result = await Subscription.findByPk(id, {
        include: [{ model: Merchant, as: "merchant" }],
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async updateByOnChainId(onChainSubscriptionId, data) {
    try {
      const sub = await Subscription.findOne({ where: { onChainSubscriptionId } });
      if (!sub) return { success: false, error: "Subscription not found" };
      await sub.update(data);
      return sub;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getMerchantSubscriptions(merchantId, page = 0, size = 20, filters = {}) {
    try {
      const where = { merchantId };
      if (filters.status) where.status = filters.status;
      if (filters.subscriber) where.subscriber = filters.subscriber;

      const subs = await Subscription.findAndCountAll({
        distinct: true,
        where,
        limit: size,
        offset: page * size,
        order: [["createdAt", "DESC"]],
      });
      return subs;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getUserSubscriptions(subscriber, page = 0, size = 20) {
    try {
      const subs = await Subscription.findAndCountAll({
        distinct: true,
        where: { subscriber },
        include: [{ model: Merchant, as: "merchant" }],
        limit: size,
        offset: page * size,
        order: [["createdAt", "DESC"]],
      });
      return subs;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getActiveSubscriptions() {
    try {
      const subs = await Subscription.findAll({
        where: { status: "active" },
      });
      return subs;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  static async getOverdueSubscriptions(daysSince = 7) {
    try {
      const cutoff = new Date(Date.now() - daysSince * 24 * 60 * 60 * 1000);
      const subs = await Subscription.findAll({
        where: {
          status: "active",
          failedChargeCount: { [Op.gte]: 3 },
          lastChargeAt: { [Op.lt]: cutoff },
        },
      });
      return subs;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  static async existsByOnChainId(onChainSubscriptionId) {
    try {
      const count = await Subscription.count({ where: { onChainSubscriptionId } });
      return count > 0;
    } catch (error) {
      return false;
    }
  }
}

module.exports = SubscriptionEntity;
