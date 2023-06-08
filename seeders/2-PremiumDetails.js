'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const items = [
            {userId: 3, grantedSince: '2023-5-1', status: false},
            {userId: 3, grantedSince: Sequelize.literal('NOW()'), status: true},
        ];
        items.forEach(item => {
            
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
        });
        await queryInterface.bulkInsert('PremiumDetails', items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('PremiumDetails', null, {});
    }
};
