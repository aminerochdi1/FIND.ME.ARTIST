'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("DiscountCodes", "disabled", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("DiscountCodes", "disabled")
  }
};
