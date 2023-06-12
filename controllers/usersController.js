"use strict";
const { contextsKey } = require("express-validator/src/base");
const models = require("../models");
const { create } = require("express-handlebars");
const Op = require('sequelize').Op;
const controller = {};

controller.showProfile = async (req, res) => {
    const user = req.user;
    const typeId = user.dataValues.typeId;
    if (typeId == 2) {
        user.writer = true;
    } else if (typeId == 3) {
        user.editor = true;
        // Lay chuyen muc quan ly
        try {
            const category = await models.Category.findOne({
                where: { id: user.dataValues.categoryManagement },
            });
            console.log(category);
            if (category != null) {
                user.categoryName = category.dataValues.title;
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (user.writer) {
        try {

        } catch (error) {
            console.log(error);
        }
    } else if (user.editor) {
        try {
            // Lấy những bài post thuộc chuyên mục mình quản lý mà chưa duyệt
            const yetUnapprovedPosts = await models.Post.findAll({
                attributes: ["id", "title", "summary", "thumbnailUrl", "publishedAt", "authorId", "statusId"],
                include: [{
                    model: models.Category,
                    attributes: ["id", "title"],
                    where: {
                        parentId: null
                    }
                }
                ],
                where: {
                    authorId: user.dataValues.id,
                    statusId: 2
                },
                order: [["publishedAt", "DESC"]]
            });
            res.locals.yetUnapprovedPosts = yetUnapprovedPosts;

            // const approvedPosts = await models.ApprovedPost.findAll({
            //   attributes: ["id", "approvedAt", "approverId"],
            //   include: [
            //     {
            //       model: models.Post,
            //       attributes: ["id"]
            //     }
            // ],
            //   where: {
            //     approverId: user.dataValues.id
            //   },
            //   order: [["approvedAt", "DESC"]]
            // });
            // res.locals.approvedPosts = approvedPosts;

        } catch (error) {
            console.log(error);
        }
    }

    res.locals.user = user;
    res.render("profile");
};

controller.updateInfomations = async (req, res) => {
    const user = req.user;
    const typeId = user.dataValues.typeId;
}

controller.showEditor = async (req, res, next) => {
    res.locals.userId = req.user.id;

    // get categories
    let categories_raw = await models.Category.findAll({
        attributes: ['id', 'parentId', 'title'],
        where: {
            removedAt: {
                [Op.is]: null
            }
        },
        raw: true
    });
    let categories = [];
    categories_raw.forEach(category => {
        if (category.parentId == null)
            categories.push({
                category: {
                    id: category.id,
                    title: category.title
                },
                sub_categories: []
            })
    })
    categories_raw.forEach(category => {
        if (category.parentId != null) {
            let idx = categories.findIndex(({ category: { id } }) => id == category.parentId);
            if (idx >= 0)
                categories[idx].sub_categories.push({
                    sub_id: category.id,
                    sub_title: category.title
                })
        }
    })
    res.locals.editorCategories = categories;

    res.render('editor', { layout: false });
}

controller.handleUpload = (req, res, next) => {
    // console.log('upload called');
    // console.log(req.file);

    if (req.file)
        return res.json({ location: req.file.path });

    res.json({ location: 'https://nextdoorsec.com/wp-content/uploads/2022/12/Sorry-Something-Went-Wrong.png' })
}

async function registerTag(tag) {
    let [row, created] = await models.Tag.findOrCreate({
        where: {
            title: {
                [Op.like]: tag
            }
        },
        defaults: {
            title: tag
        }
    })

    //console.log(`Register Tag returning: ${row.id}`);
    return row.id;
}

async function registerTags(tags) {
    let promises = tags.map((tag) => registerTag(tag));
    let result = await Promise.all(promises);
    return result;
}

controller.handleSubmission = async (req, res, next) => {
    const authorId = req.body.authorId;
    if (req.user.id != authorId || req.user.typeId != 2)
        return { ok: false, message: 'Unauthorized' };

    const tags = req.body.tags.map(value => value.trim().toUpperCase());
    //console.log(`tags: ${tags}`);

    // register tags
    let tag_idxs = await registerTags(tags);
    //console.log(`Registered tags ${tag_idxs}`)

    // register post
    let post = await models.Post.create({
        authorId: authorId,
        title: req.body.title,
        summary: req.body.summary,
        statusId: 2,
        publishedAt: null,
        removedAt: null,
        thumbnailUrl: req.body.thumbnailUrl,
        content: req.body.content,
        isPremium: false
    })
    //console.log(`Registered post ${post}`)

    // register post's tags
    let tagInsertPromises = tag_idxs.map(tag => models.PostTag.create({
        postId: post.id,
        tagId: tag
    }));

    // register post's categories
    let categories = req.body.categories;
    let catInsertPromises = categories.map(cat => models.PostCategory.create({
        postId: post.id,
        categoryId: cat
    }));

    await Promise.all(tagInsertPromises, catInsertPromises);
    res.json({ completed: true });
    //res.json(tags_idx);
}

module.exports = controller;
