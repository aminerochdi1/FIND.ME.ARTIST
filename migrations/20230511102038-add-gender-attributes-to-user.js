'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Profiles", "gender", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Profiles", "gender");
  }
};
