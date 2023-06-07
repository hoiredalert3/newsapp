"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/postsController");
const authController = require('../controllers/authController')
router.use(authController.isLoggedIn)

router.get("/", controller.showPosts);

router.get("/original", controller.showOriginalPost);

router.get("/:id", controller.showPost);

module.exports = router;
