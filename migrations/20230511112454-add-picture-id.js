'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Profiles", "picture_id", {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("Profiles", "picture_id")
  }
};
