'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn("Users", "confirmation_token", {
      type: Sequelize.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "confirmation_token")
  }
};
