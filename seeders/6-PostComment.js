'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = require('./sample_data/PostComments.json');
    items.forEach((item) => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      item.parentId = null;
      item.publishedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('PostComments', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PostComments', null, {});
  }
};
