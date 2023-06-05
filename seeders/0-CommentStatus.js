'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const items = [
            { name: "Được duyệt" },
            { name: "Bị ẩn" },
        ];
        items.forEach(item => {
            item.name = item.name.toLocaleUpperCase();
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
        });
        await queryInterface.bulkInsert('CommentStatuses', items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('CommentStatuses', null, {});
    }
};
