"use strict";

// Declare controller
const controller = {};
const models = require("../models");

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
    ],
    limit: 5,
  });
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
    order: [["publishedAt", "DESC"]],
    limit: 10,
  });
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
        order: [["hot", "DESC"]],
      },
      {
        model: models.PostStatus,
        where: {
          id: 5, // Xuat ban
        },
      },
    ],
    limit: 10,
  });
  res.locals.mostViewPosts = mostViewPosts;

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
