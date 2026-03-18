"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      this.belongsTo(models.Merchant, {
        foreignKey: "merchantId",
        as: "merchant",
      });
    }

    toJSON() {
      return {
        ...this.get(),
        updatedAt: undefined,
      };
    }
  }

  Subscription.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      onChainSubscriptionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      merchantId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      onChainMerchantId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subscriber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
      },
      interval: {
        type: DataTypes.ENUM("weekly", "monthly", "quarterly", "yearly"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "paused", "cancelled", "past_due"),
        allowNull: false,
        defaultValue: "active",
      },
      chargeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      failedChargeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastChargeAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nextChargeAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastPaymentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customerEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transactionHash: {
        type: DataTypes.STRING,
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
    },
    {
      sequelize,
      tableName: "subscriptions",
      modelName: "Subscription",
    }
  );

  return Subscription;
};
