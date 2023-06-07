"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = require('./sample_data/posts.json');
        let items = []
        data.forEach(datum => {
            items.push(datum.article);
        })
        

        // Chọn ngẫu nhiên phóng viên
        const models = require("../models");
        const writers = await models.User.findAll({
            attributes: ["id"],
            where: {
                typeId: 2,
            },
        });

        items.forEach((item) => {
            let randomAuthor =
                writers[Math.floor(Math.random() * writers.length)].dataValues;
            //console.log(randomAuthor);
            item.authorId = randomAuthor.id;
            item.removedAt = null;
            item.publishedAt = Sequelize.literal("NOW()");
            item.createdAt = Sequelize.literal("NOW()");
            item.updatedAt = Sequelize.literal("NOW()");
        });
        await queryInterface.bulkInsert("Posts", items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Posts", null, {});
    },
};
