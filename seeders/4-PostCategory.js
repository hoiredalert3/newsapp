"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require('./sample_data/posts.json');
    let items = [];
    data.forEach(datum => {
      let post_idx = datum.idx;
      datum.cat_idxs.forEach(cat_idx => {
        items.push({
          postId: post_idx,
          categoryId: cat_idx
        });
      });
    });

    items.forEach((item) => {
      item.createdAt = Sequelize.literal("NOW()");
      item.updatedAt = Sequelize.literal("NOW()");
    });
    await queryInterface.bulkInsert("PostCategories", items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("PostCategories", null, {});
  },
};
