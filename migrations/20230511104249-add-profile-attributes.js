'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Profiles", "agency1", {
      type: Sequelize.STRING,
      allowNull: true,
    })
    await queryInterface.addColumn("Profiles", "agency2", {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Profiles", "agency1");
    await queryInterface.removeColumn("Profiles", "agency2");
  }
};
