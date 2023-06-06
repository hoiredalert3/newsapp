"use strict";

// Declare controller
const controller = {};
const models = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

// Show homepage
controller.showHomePage = async (req, res) => {
  // Hots post
  const hotPosts = await models.Post.findAll({
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
        model: models.PostStatistic,
        attributes: ["id", "postId", "hot"],
        order: [["hot", "DESC"]],
      },
      {
        model: models.PostStatus,
        where: {
          id: 5, // Xuat ban
        },
      },
      {
        model: models.Category,
        attributes: ["id", "title", "parentId"],
        where: { parentId: { [Op.not]: null } },
      },
    ],
    where: {
      removedAt: null,
    },
    limit: 5,
  });

  hotPosts.forEach(async (item) => {
    let childCategory = item.Categories[0];
    item.childCategory = childCategory;
    item.parentCategory = await models.Category.findOne({
      where: { id: childCategory.dataValues.parentId },
    });
  });

  //console.log(hotPosts);
  res.locals.hotPosts = hotPosts;

  // New posts
  const newPosts = await models.Post.findAll({
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
        model: models.PostStatus,
        where: {
          id: 5, // Xuat ban
        },
      },
      {
        model: models.Category,
        attributes: ["id", "title", "parentId"],
        where: {
          parentId: { [Op.not]: null } 
        }
      }
    ],
    where: {
      removedAt: null,
    },
    order: [["publishedAt", "DESC"]],
    limit: 10,
  });

  newPosts.forEach(async (item) => {
    let childCategory = item.Categories[0];
    item.childCategory = childCategory;
    item.parentCategory = await models.Category.findOne({
      where: { id: childCategory.dataValues.parentId },
    });
  });
  console.log(newPosts)
  res.locals.newPosts = newPosts;

  // Most view posts
  const mostViewPosts = await models.Post.findAll({
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
        model: models.PostStatistic,
        attributes: ["id", "postId", "views"],
        order: [["views", "DESC"]],
      },
      {
        model: models.PostStatus,
        where: {
          id: 5, // Xuat ban
        },
      },
    ],
    where: {
      removedAt: null,
    },
    limit: 10,
  });
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
        include: [
          {
            model: models.PostStatus,
            where: {
              id: 5,
            },
          },
        ],
        order: [["publishedAt", "DESC"]],
      },
    ],
    where: {
      parentId: null,
    },
  });

  categoryPosts.forEach((item) => {
    if (item.dataValues.Posts.length > 0) {
      item.Post = item.dataValues.Posts[0];
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

  res.render("index");
};

controller.showPage = (req, res, next) => {
  const pages = [
    "post-list-category",
    "admin-categories",
    "post-list-tag",
    "profile",
    "admin",
    "admin-categories",
    "admin-posts",
    "admin-tags",
    "admin-users",
    "signin",
    "signup",
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
