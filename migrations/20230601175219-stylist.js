'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Jobs', [
      { name: "fashion_designer", }
    ]);

  },

  async down (queryInterface, Sequelize) {
  }
};
