'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const items = [
            // test
            {postId: 1, categoryId: 1},
            {postId: 2, categoryId: 2},
            {postId: 3, categoryId: 3},
            {postId: 4, categoryId: 4},
            {postId: 5, categoryId: 5},
            {postId: 2, categoryId: 6},
            {postId: 3, categoryId: 7},

            {postId: 5, categoryId: 1},
            {postId: 2, categoryId: 3},
            {postId: 5, categoryId: 4},
            {postId: 1, categoryId: 5},
            {postId: 3, categoryId: 6},


            {postId: 1, categoryId: 12},
        ];
        items.forEach(item => {
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
        });
        await queryInterface.bulkInsert('PostCategories', items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('PostCategories', null, {});
    }
};
