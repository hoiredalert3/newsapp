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
        let premium_indexes = []
        let max_premium_posts = items.length * 0.3;
        for(let i = 0; i < max_premium_posts; i++){
            let n = Math.floor(Math.random() * items.length);
            if(premium_indexes.includes(n) == false){
                premium_indexes.push(n);
            }
            else i--;
        }

        for (let i = 0; i < max_premium_posts; i++){
            items[premium_indexes[i]].isPremium = true; 
        }

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
