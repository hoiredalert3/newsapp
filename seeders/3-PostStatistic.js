'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const items = [
            {postId: 1, views: 10, hot: 3},
            {postId: 2, views: 0, hot: 5},
            {postId: 3, views: 1, hot: 3},
            {postId: 4, views: 2, hot: 2},
            {postId: 5, views: 3, hot: 3}
        ];
        items.forEach(item => {
            
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
        });
        await queryInterface.bulkInsert('PostStatistics', items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('PostStatistics', null, {});
    }
};
