"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PaymentSession extends Model {
    static associate(models) {
      this.belongsTo(models.Merchant, {
        foreignKey: "merchantId",
        as: "merchant",
      });
      this.hasOne(models.Transaction, {
        foreignKey: "sessionId",
        as: "transaction",
      });
    }

    toJSON() {
      return {
        ...this.get(),
        updatedAt: undefined,
      };
    }
  }

  PaymentSession.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      sessionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      merchantId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("one_time", "subscription"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
      },
      currency: {
        type: DataTypes.ENUM("USDC", "USDT"),
        allowNull: false,
        defaultValue: "USDC",
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "awaiting_approval",
          "processing",
          "completed",
          "failed",
          "expired"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customerEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      successUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cancelUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subscriptionInterval: {
        type: DataTypes.ENUM("weekly", "monthly", "quarterly", "yearly"),
        allowNull: true,
      },
      onChainPaymentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      onChainSubscriptionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transactionHash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      blockNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const jsonString = this.getDataValue("metadata");
          return jsonString ? JSON.parse(jsonString) : null;
        },
        set(value) {
          this.setDataValue("metadata", value ? JSON.stringify(value) : null);
        },
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "payment_sessions",
      modelName: "PaymentSession",
    }
  );

  return PaymentSession;
};
