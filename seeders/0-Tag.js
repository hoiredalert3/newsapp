'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        var items = require('./sample_data/tags.json');
        items.forEach(item => {
            item.removedAt = null;
            item.content = null;
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
        });

        await queryInterface.bulkInsert('Tags', items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Tags', null, {});
    }
};
