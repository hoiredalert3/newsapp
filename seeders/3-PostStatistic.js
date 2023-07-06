'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const items = [];
        const models = require("../models");
        const posts = await models.Post.findAll({where: {statusId: 5}});
        posts.forEach(post => {
            items.push({
                postId: post.dataValues.id,
                views: 0,
                lastUpdatedHot: Sequelize.literal('NOW()'),
                hot: 0
            })
        })
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
