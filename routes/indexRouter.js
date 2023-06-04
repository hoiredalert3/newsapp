"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");

router.get("/createDB", (req, res) => {
  let models = require("../models");
  models.sequelize.sync().then(() => {
    res.render("success", { message: "Create database successfully!" });
  });
});

router.get("/", controller.showHomePage);
router.get("/:page", controller.showPage);

// router.get("/:page", controller.showPage);

module.exports = router;
