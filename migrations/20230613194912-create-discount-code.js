'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DiscountCodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      reduction: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      expireAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    const date = new Date();
    const expireAt = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
    await queryInterface.bulkInsert('DiscountCodes', [
      {
        code: 'DEVTEST',
        reduction: 0.4,
        expireAt: expireAt,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DiscountCodes');
  }
};