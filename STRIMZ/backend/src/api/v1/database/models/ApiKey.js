"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ApiKey extends Model {
    static associate(models) {
      this.belongsTo(models.Merchant, {
        foreignKey: "merchantId",
        as: "merchant",
      });
    }

    toJSON() {
      return {
        ...this.get(),
        hashedKey: undefined,
      };
    }
  }

  ApiKey.init(
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
      hashedKey: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      keyType: {
        type: DataTypes.ENUM("public", "secret"),
        allowNull: false,
      },
      environment: {
        type: DataTypes.ENUM("live", "test"),
        allowNull: false,
        defaultValue: "live",
      },
      prefix: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lastUsedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      requestCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "api_keys",
      modelName: "ApiKey",
    }
  );

  return ApiKey;
};
