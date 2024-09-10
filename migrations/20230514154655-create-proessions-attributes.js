'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Profiles", "main_profession", {
      type: Sequelize.INTEGER,
      allowNull: true,
    })
    await queryInterface.addColumn("Profiles", "secondary_profession", {
      type: Sequelize.INTEGER,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("Profiles", "main_profession")
    queryInterface.removeColumn("Profiles", "secondary_profession")
  }
};
