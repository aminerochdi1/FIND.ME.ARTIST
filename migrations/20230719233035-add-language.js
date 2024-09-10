'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "language", {
      type: Sequelize.STRING,
      defaultValue: "en"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "language")
  }
};
