"use strict";

// Declare controller
const controller = {};
const models = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

async function getCategories(posts) {
  try {
    posts.forEach(async (item) => {
      const childCategory = item.Categories[0];
      item.childCategory = childCategory;
      item.parentCategory = await models.Category.findOne({
        where: { id: childCategory.dataValues.parentId },
      });
    });
  } catch (error) {
    console.log(error);
  }
}

// Show homepage
controller.showHomePage = async (req, res) => {
  try {
    // Hots post
    let hotPosts = [];
    let statsPost = await models.PostStatistic.findAll({
      include: [
        {
          model: models.Post,
          where: {
            removedAt: null,
            statusId: 5,
          },
          include: [
            {
              model: models.Category,
              attributes: ["id", "title", "parentId"],
              where: { parentId: { [Op.not]: null } },
            },
          ],
        },
      ],
      order: [["hot", "DESC"]],
      limit: 5,
    });
    statsPost.forEach((stat) => {
      hotPosts.push(stat.Post);
    });
    // console.log(hotPosts);
    getCategories(hotPosts);

    //console.log(hotPosts);
    res.locals.hotPosts = hotPosts;

    // New posts
    let newPosts = await models.Post.findAll({
      attributes: [
        "id",
        "title",
        "publishedAt",
        "thumbnailUrl",
        "summary",
        "isPremium",
      ],
      include: [
        {
          model: models.Category,
          attributes: ["id", "title", "parentId"],
          where: {
            parentId: { [Op.not]: null },
          },
        },
      ],
      where: {
        removedAt: null,
        statusId: 5,
      },
      order: [["publishedAt", "DESC"]],
      limit: 10,
    });

    getCategories(newPosts);
    res.locals.newPosts = newPosts;
    
    // Most view posts
    let mostViewPosts = [];

     statsPost = await models.PostStatistic.findAll({
      include: [
        {
          model: models.Post,
          where: {
            removedAt: null,
            statusId: 5,
          },
          include: [
            {
              model: models.Category,
              attributes: ["id", "title", "parentId"],
              where: { parentId: { [Op.not]: null } },
            },
          ],
        },
      ],
      order: [["views", "DESC"]],
      limit: 10,
    });

    statsPost.forEach((stat) => {
      mostViewPosts.push(stat.Post);
    });

    getCategories(mostViewPosts);
    res.locals.mostViewPosts = mostViewPosts;

    // category-posts
    const categoryPosts = await models.Category.findAll({
      attributes: ["id", "title", "parentId"],
      include: [
        {
          model: models.Post,
          attributes: [
            "id",
            "title",
            "publishedAt",
            "thumbnailUrl",
            "summary",
            "isPremium",
          ],
          where: { statusId: 5 },
          order: [["publishedAt", "DESC"]],
        },
      ],
      where: {
        parentId: null,
      },
    });
    categoryPosts.forEach((item) => {
      if (item.dataValues.Posts.length > 0) {
        item.Post = item.dataValues.Posts[item.dataValues.Posts.length - 1];
        // console.log(item.Post.dataValues.publishedAt);
      }
    });
    // console.log(categoryPosts);
    let leftCategoryPosts = categoryPosts.splice(
      0,
      Math.ceil(categoryPosts.length * 0.25)
    );
    let rightCategoryPosts = categoryPosts;
    //console.log(leftCategoryPosts);
    res.locals.leftCategoryPosts = leftCategoryPosts;
    res.locals.rightCategoryPosts = rightCategoryPosts;
  } catch (error) {
    console.log(`Index controller error: ${error}`);
  }

  res.render("index", {
    publishMessage: req.query.publishMessage,
  });
};

controller.showPage = (req, res, next) => {
  const pages = [
    "post-list-category",
    "post-list-tag",
    "profile",
    // "admin",
    // "admin-categories",
    // "admin-posts",
    // "admin-tags",
    // "admin-users",
    //"signin",
    // "signup",
    "writer-create",
    "article-review",
    "publish-article",
    "forgot-password",
  ];
  if (pages.includes(req.params.page)) {
    return res.render(req.params.page);
  }
  next();
};

module.exports = controller;
