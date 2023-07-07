"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController");
const authController = require("../controllers/authController");

router.use(authController.isLoggedIn, authController.isAdmin);

router.get("/dashboard", controller.showDashboard);

router.get("/categories", controller.showCategories);

router.post("/categories", controller.addCategory);

router.put("/categories", controller.updateCategory);

router.delete("/categories", controller.deleteCategory);

router.get("/categories/parent", controller.getParentCategories);

module.exports = router;
