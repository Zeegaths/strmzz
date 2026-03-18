"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transactions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      onChainPaymentId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: "bytes32 paymentId from contract",
      },
      sessionId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "payment_sessions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      payer: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Payer wallet address",
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "ERC20 token contract address",
      },
      amount: {
        type: Sequelize.DECIMAL(20, 6),
        allowNull: false,
      },
      fee: {
        type: Sequelize.DECIMAL(20, 6),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.ENUM("USDC", "USDT"),
        allowNull: false,
        defaultValue: "USDC",
      },
      status: {
        type: Sequelize.ENUM("pending", "completed", "failed", "refunded"),
        allowNull: false,
        defaultValue: "completed",
      },
      type: {
        type: Sequelize.ENUM("one_time", "subscription"),
        allowNull: false,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subscriptionId: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "On-chain subscription ID if this is a subscription charge",
      },
      transactionHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      blockNumber: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("transactions");
  },
};
