'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('whitelists', {

      whitelistId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tokenAddress: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tokenName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tokenSymbol: {
        allowNull: false,
        type: Sequelize.STRING
      },
      networkId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      decimals: {
        allowNull: false,
        type: Sequelize.INTEGER
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('whitelists');
  }
};