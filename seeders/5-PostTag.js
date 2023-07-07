'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = require('./sample_data/PostTags.json');
    items.forEach((item) => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('PostTags', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PostTags', null, {});
  }
};
