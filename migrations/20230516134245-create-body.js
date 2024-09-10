'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bodies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profile_id: {
        type: Sequelize.INTEGER
      },
      ethnic: {
        type: Sequelize.INTEGER
      },
      hair: {
        type: Sequelize.INTEGER
      },
      eyes: {
        type: Sequelize.INTEGER
      },
      height: {
        type: Sequelize.INTEGER
      },
      bust: {
        type: Sequelize.INTEGER
      },
      hip: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.INTEGER
      },
      waist: {
        type: Sequelize.INTEGER
      },
      shoe: {
        type: Sequelize.INTEGER,
      },
      tattoo: {
        type: Sequelize.BOOLEAN
      },
      body_modification: {
        type: Sequelize.BOOLEAN
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bodies');
  }
};