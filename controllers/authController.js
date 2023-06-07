"use strict";

const controller = {};
const passport = require("./passport");
const models = require("../models");

controller.showLogin = (req, res) => {

      res.render("signin");
}

module.exports = controller;