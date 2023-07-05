"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController");
const authController = require("../controllers/authController");

router.use(authController.isLoggedIn, authController.isAdmin);

router.get("/dashboard", controller.showDashboard);

router.get("/categories", controller.showCategories);

module.exports = router;
