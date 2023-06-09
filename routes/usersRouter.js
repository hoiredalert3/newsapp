"use strict";

const express = require("express");
const router = express.Router();
const controller = require('../controllers/usersController')
const authController = require('../controllers/authController')
router.use(authController.isLoggedIn)

router.get("/profile", controller.showProfile);
router.post("/profile/update-infos", controller.updateInfomations)
module.exports = router;
