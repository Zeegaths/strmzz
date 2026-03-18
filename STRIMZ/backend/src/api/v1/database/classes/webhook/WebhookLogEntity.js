const { WebhookLog } = require("../../models");

class WebhookLogEntity {
  static async create(data) {
    try {
      const log = await WebhookLog.create(data);
      return log;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async updateLog(id, data) {
    try {
      const log = await WebhookLog.findByPk(id);
      if (!log) return null;
      await log.update(data);
      return log;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getMerchantLogs(merchantId, page = 0, size = 20) {
    try {
      const logs = await WebhookLog.findAndCountAll({
        where: { merchantId },
        limit: size,
        offset: page * size,
        order: [["createdAt", "DESC"]],
      });
      return logs;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }
}

module.exports = WebhookLogEntity;
