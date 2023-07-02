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
    const categoryCount = await models.User.count({});
    const tagCount = await models.User.count({});
    const postCount = await models.User.count({});
    const userCount = await models.User.count({});

    console.log(res.locals);
    res.locals.metadata = { categoryCount, tagCount, postCount, userCount };
  } catch (error) {
    console.error(error);
  }

  return res.render("admin-dashboard");
};

module.exports = controller;
