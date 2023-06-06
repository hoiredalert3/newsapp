"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let items = [
      {
        postId: 1,
        categoryId: 1,
      },
      {
        postId: 1,
        categoryId: 8,
      },
      {
        postId: 2,
        categoryId: 1,
      },
      {
        postId: 2,
        categoryId: 8,
      },
      {
        postId: 3,
        categoryId: 1,
      },
      {
        postId: 3,
        categoryId: 8,
      },
      {
        postId: 4,
        categoryId: 1,
      },
      {
        postId: 4,
        categoryId: 8,
      },
      {
        postId: 5,
        categoryId: 2,
      },
      {
        postId: 5,
        categoryId: 17,
      },
      {
        postId: 6,
        categoryId: 2,
      },
      {
        postId: 6,
        categoryId: 17,
      },
      {
        postId: 7,
        categoryId: 2,
      },
      {
        postId: 7,
        categoryId: 17,
      },
    ];
    items = items.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) => t.postId === value.postId && t.categoryId === value.categoryId
        )
    );
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
