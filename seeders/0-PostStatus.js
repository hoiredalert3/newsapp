'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const items = [
            { name: "Nháp" },
            { name: "Chưa phê duyệt" },
            { name: "Bị từ chối" },
            { name: "Được phê duyệt" }, // Những chưa được xuất bản
            { name: "Xuất bản" },
            
        ];
        items.forEach(item => {
            item.name = item.name.toLocaleUpperCase();
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
        });
        await queryInterface.bulkInsert('PostStatuses', items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('PostStatuses', null, {});
    }
};
