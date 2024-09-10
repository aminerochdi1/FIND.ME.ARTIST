'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Profiles", "agency_1_link", {
      type: Sequelize.STRING,
    })
    await queryInterface.addColumn("Profiles", "agency_2_link", {
      type: Sequelize.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
  }
};
