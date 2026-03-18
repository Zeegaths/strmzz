"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Merchant extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "owner",
      });
      this.hasMany(models.ApiKey, {
        foreignKey: "merchantId",
        as: "apiKeys",
      });
      this.hasMany(models.PaymentSession, {
        foreignKey: "merchantId",
        as: "sessions",
      });
      this.hasMany(models.Transaction, {
        foreignKey: "merchantId",
        as: "transactions",
      });
      this.hasMany(models.Subscription, {
        foreignKey: "merchantId",
        as: "subscriptions",
      });
      this.hasMany(models.WebhookLog, {
        foreignKey: "merchantId",
        as: "webhookLogs",
      });
    }

    toJSON() {
      return {
        ...this.get(),
        webhookSecret: undefined,
        updatedAt: undefined,
      };
    }
  }

  Merchant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      onChainId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      walletAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      businessEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: { msg: "invalid business email" },
        },
      },
      webhookUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      webhookSecret: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      redirectUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      totalVolume: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        defaultValue: 0,
      },
      customFeeBps: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      tableName: "merchants",
      modelName: "Merchant",
    }
  );

  return Merchant;
};
