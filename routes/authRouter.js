"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { body, getErrorMessage } = require("../controllers/validator");

router.get("/login", controller.showLogin);
router.post(
  "/login",
  body("account")
    .trim()
    .notEmpty()
    .withMessage("Account is required!"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    let message = getErrorMessage(req);
    if (message) {
      return res.render("signin", { loginMessage: message });
    }
    next();
  },
  controller.login
);
router.get("/logout", controller.logout);

module.exports = router;
