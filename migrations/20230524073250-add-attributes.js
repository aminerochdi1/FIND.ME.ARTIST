'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Profiles", "show_phone_number", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
    await queryInterface.addColumn("Profiles", "show_email", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("Profiles", "show_phone_number")
    queryInterface.removeColumn("Profiles", "show_email")
  }
};
