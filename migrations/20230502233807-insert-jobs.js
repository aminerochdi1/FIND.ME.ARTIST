'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Jobs', [
      { name: "model", },
      { name: "actor" },
      { name: "makeup_artist" },
      { name: "hairdresser" },
      { name: "photographer" },
      { name: "video_maker" },
      { name: "influencer" },
      { name: "designer" },
      { name: "singer" },
      { name: "producer" },
      { name: "musician" },
      { name: "vocalist" },
      { name: "sound_engineer" },
      { name: "art_director" },
      { name: "dancer" },
      { name: "extra_stuntman" },
      { name: "voice_over" },
      { name: "appearing", }
    ]);
  },

  async down(queryInterface, Sequelize) {
  }
};
