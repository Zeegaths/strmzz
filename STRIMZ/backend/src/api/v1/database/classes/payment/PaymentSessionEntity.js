const crypto = require("crypto");
const { PaymentSession, Merchant } = require("../../models");
const { Op } = require("sequelize");

class PaymentSessionEntity {
  static async createSession(data) {
    try {
      const sessionId = `cs_${crypto.randomBytes(16).toString("hex")}`;
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

      const session = await PaymentSession.create({
        ...data,
        sessionId,
        expiresAt,
      });
      return session;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getSessionBySessionId(sessionId) {
    try {
      const result = await PaymentSession.findOne({
        where: { sessionId },
        include: [{ model: Merchant, as: "merchant" }],
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getSessionById(id) {
    try {
      const result = await PaymentSession.findByPk(id, {
        include: [{ model: Merchant, as: "merchant" }],
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async updateSession(id, data) {
    try {
      const session = await PaymentSession.findByPk(id);
      if (!session) return { success: false, error: "Session not found" };
      await session.update(data);
      return session;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getMerchantSessions(merchantId, page = 0, size = 20) {
    try {
      const sessions = await PaymentSession.findAndCountAll({
        distinct: true,
        where: { merchantId },
        limit: size,
        offset: page * size,
        order: [["createdAt", "DESC"]],
      });
      return sessions;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  /**
   * Find a pending session matching an on-chain payment event
   */
  static async findPendingByMerchantAndReference(onChainMerchantId, reference) {
    try {
      const where = {
        status: { [Op.in]: ["pending", "processing"] },
      };

      // Try to match by reference first, fall back to merchant
      if (reference) {
        where.reference = reference;
      }

      const sessions = await PaymentSession.findAll({
        where,
        include: [{
          model: Merchant,
          as: "merchant",
          where: { onChainId: onChainMerchantId },
        }],
        order: [["createdAt", "DESC"]],
        limit: 1,
      });

      return sessions.length > 0 ? sessions[0] : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Expire stale sessions (called by cron)
   */
  static async expireStaleSessions() {
    try {
      const [count] = await PaymentSession.update(
        { status: "expired" },
        {
          where: {
            status: { [Op.in]: ["pending", "awaiting_approval"] },
            expiresAt: { [Op.lt]: new Date() },
          },
        }
      );
      return count;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}

module.exports = PaymentSessionEntity;
