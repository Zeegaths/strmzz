"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      this.belongsTo(models.Merchant, {
        foreignKey: "merchantId",
        as: "merchant",
      });
      this.belongsTo(models.PaymentSession, {
        foreignKey: "sessionId",
        as: "session",
      });
    }

    toJSON() {
      return {
        ...this.get(),
        updatedAt: undefined,
      };
    }
  }

  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      onChainPaymentId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      sessionId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      merchantId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      onChainMerchantId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payer: {
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
      fee: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: DataTypes.ENUM("USDC", "USDT"),
        allowNull: false,
        defaultValue: "USDC",
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
        allowNull: false,
        defaultValue: "completed",
      },
      type: {
        type: DataTypes.ENUM("one_time", "subscription"),
        allowNull: false,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subscriptionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transactionHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      blockNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "transactions",
      modelName: "Transaction",
    }
  );

  return Transaction;
};
