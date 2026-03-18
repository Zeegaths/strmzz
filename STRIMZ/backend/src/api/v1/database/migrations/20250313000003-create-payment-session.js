"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payment_sessions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      sessionId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: "Public session ID used in checkout URLs",
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
      type: {
        type: Sequelize.ENUM("one_time", "subscription"),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(20, 6),
        allowNull: false,
      },
      currency: {
        type: Sequelize.ENUM("USDC", "USDT"),
        allowNull: false,
        defaultValue: "USDC",
      },
      status: {
        type: Sequelize.ENUM(
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
        type: Sequelize.STRING,
        allowNull: true,
        comment: "External reference from merchant (order ID, invoice, etc.)",
      },
      customerEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      successUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cancelUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subscriptionInterval: {
        type: Sequelize.ENUM("weekly", "monthly", "quarterly", "yearly"),
        allowNull: true,
        comment: "Only set for subscription type sessions",
      },
      onChainPaymentId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      onChainSubscriptionId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transactionHash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      blockNumber: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable("payment_sessions");
  },
};
