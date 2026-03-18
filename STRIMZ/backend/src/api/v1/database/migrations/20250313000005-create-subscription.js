"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subscriptions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      onChainSubscriptionId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: "bytes32 subscriptionId from contract",
      },
      merchantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "merchants",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      onChainMerchantId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subscriber: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Subscriber wallet address",
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(20, 6),
        allowNull: false,
      },
      interval: {
        type: Sequelize.ENUM("weekly", "monthly", "quarterly", "yearly"),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("active", "paused", "cancelled", "past_due"),
        allowNull: false,
        defaultValue: "active",
      },
      chargeCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      failedChargeCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastChargeAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      nextChargeAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      lastPaymentId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      customerEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transactionHash: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Tx hash of the createSubscription call",
      },
      metadata: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("subscriptions");
  },
};
