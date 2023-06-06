"use strict";

const models = require("../models");

// Declare controller
const controller = {};

// Show post
controller.showPosts = async (req, res) => {
  let options = {
    where: {},
    include: [],
    order: [],
  };

  const posts = await models.Post.findAll(options);
  res.locals.posts = posts;

  res.render("post-list-category");
};

// Show post
controller.showPost = async (req, res) => {
  const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

  console.log(`Post id: ${id}`);

  const post = await models.Post.findOne({
    where: { id },
    include: [],
  });
  if (post) {
    console.log(post.dataValues);
    res.locals.post = post;

    return res.render("post-detail");
  }
  res.redirect("/404");
};

// Show post
controller.showOriginalPost = async (req, res) => {
  res.render("post");
};

module.exports = controller;
