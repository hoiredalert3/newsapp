"use strict";
const models = require("../models");
const controller = {};

controller.showProfile = async (req, res) => {
  let id = req.user.dataValues.id;
  const user = await models.User.findOne({ where: { id } });
  res.locals.user = user;
  res.render("profile");
};

module.exports = controller;
