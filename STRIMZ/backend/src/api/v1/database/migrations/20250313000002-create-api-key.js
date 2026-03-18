"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("api_keys", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
      hashedKey: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      keyType: {
        type: Sequelize.ENUM("public", "secret"),
        allowNull: false,
      },
      environment: {
        type: Sequelize.ENUM("live", "test"),
        allowNull: false,
        defaultValue: "live",
      },
      prefix: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Display prefix like pk_live_a1b2 for identification",
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lastUsedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      requestCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable("api_keys");
  },
};
