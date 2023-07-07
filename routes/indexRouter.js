"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");

router.get("/createDB", (req, res) => {
  let models = require("../models");
  models.sequelize.sync().then(() => {
    models.Post.addSearchIndex();
    res.render("success", { message: "Create database successfully!" });
  });
});

router.get("/dropSession", (req, res) => {
  req.session.destroy();
});

router.get("/dropDB", (req, res) => {
  // destroy session
  req.session.destroy();
  // drop db
  let models = require("../models");
  let sequelize = models.sequelize
  sequelize
    .sync() // create the database table for our model(s)
    .then(function () {
      res.render("success", { message: "Drop database successfully!" });
    })
    .then(function () {
      return sequelize.drop() // drop all tables in the db
    });
})

router.get("/", controller.showHomePage);
router.get("/:page", controller.showPage);

// router.get("/:page", controller.showPage);

module.exports = router;
