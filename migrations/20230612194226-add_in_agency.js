'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Profiles", "in_agency", {
      type: Sequelize.BOOLEAN,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Profiles", "in_agency")
  }
};
