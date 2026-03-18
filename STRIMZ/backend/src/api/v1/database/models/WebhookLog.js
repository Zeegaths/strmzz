"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WebhookLog extends Model {
    static associate(models) {
      this.belongsTo(models.Merchant, {
        foreignKey: "merchantId",
        as: "merchant",
      });
    }
  }

  WebhookLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      merchantId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eventType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payload: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          const jsonString = this.getDataValue("payload");
          return jsonString ? JSON.parse(jsonString) : null;
        },
        set(value) {
          this.setDataValue("payload", value ? JSON.stringify(value) : null);
        },
      },
      signature: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "delivered", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      statusCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      attempt: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      error: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "webhook_logs",
      modelName: "WebhookLog",
    }
  );

  return WebhookLog;
};
