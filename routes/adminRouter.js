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

router.get("/tags", controller.showTags);

router.post("/tags", controller.addTag);

router.put("/tags", controller.updateTag);

router.delete("/tags", controller.deleteTag);

router.get("/users", controller.showUsers);

router.post("/users", controller.addUser);

router.put("/users", controller.updateUser);

router.delete("/users", controller.deleteUser);

module.exports = router;
