"use strict";

const controller = {};
const passport = require("./passport");
const models = require("../models");

controller.showLogin = (req, res) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("signin", {
    loginMessage: req.flash("loginMessage"),
    reqUrl: req.query.reqUrl,
  });
};

controller.showDashboard = async (req, res) => {
  try {
    const categoryCount = await models.Category.count({});
    const tagCount = await models.Tag.count({});
    const postCount = await models.Post.count({});
    const userCount = await models.User.count({});

    console.log(res.locals);
    res.locals.metadata = { categoryCount, tagCount, postCount, userCount };
  } catch (error) {
    console.error(error);
  }

  return res.render("admin-dashboard");
};

controller.showCategories = async (req, res) => {
  try {
    return res.render("admin-categories");
  } catch (error) {
    console.error("Error in /admin/categories controller: ", error);
  }
};

module.exports = controller;
