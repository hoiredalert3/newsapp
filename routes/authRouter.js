"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

const { body, getErrorMessage } = require("../controllers/validator");

router.get("/login", controller.showLogin);
router.post(
  "/login",
  body("account").trim().notEmpty().withMessage("Account is required!"),
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

router.get("/register", controller.showSignup);

router.post(
  "/register",
  body("username").trim().notEmpty().withMessage("Yêu cầu nhập username"),
  body("username")
    .matches(/[A-Za-z](?=.*\d)(?=.*[A-Za-z]).{5,}/)
    .withMessage(
      "Username gồm ít nhất 6 kí từ gồm chữ đầu tiên phải là chữ cái, gồm ít nhất 1 chữ cái và 1 chữ số!"
    ),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Yêu cầu nhập email!")
    .isEmail()
    .withMessage("Email không hợp lệ"),
  body("password").trim().notEmpty().withMessage("Yêu cầu nhập mật khẩu"),
  body("password")
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    .withMessage(
      "Mật khẩu phải gồm ít nhất 1 chữ cái thường, 1 in hoa, 1 chữ số, 1 kí tự đặc biệc và 8 kí tự."
    ),
  body("confirmPassword").custom((confirmPassword, { req }) => {
    if (confirmPassword != req.body.password) {
      throw new Error("Mật khẩu nhập lại không khớp");
    }
    return true;
  }),
  body("name").trim().notEmpty().withMessage("Your name is required!"),
  body("dob").trim().notEmpty().withMessage("Your birthday is required!"),

  (req, res, next) => {
    let message = getErrorMessage(req);
    if (message) {
      return res.render("signup", { registerMessage: message });
    }
    next();
  },
  controller.signup
);
router.get("/logout", controller.logout);

// Forgot password
router.get("/forgot", (req, res) => {
  res.render("forgot-password-0", {message: req.query.message});
});
router.get("/otp", controller.showOTPVerify);
router.get("/reset", controller.showResetPassword);

router.post("/forgot", controller.forgotPassword1);
router.post("/otp", controller.OTPVerify);
router.post(
  "/reset",
  body("password").trim().notEmpty().withMessage("Password is required!"),
  body("password")
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
    .withMessage(
      "Mật khẩu phải gồm ít nhất 1 chữ cái thường, 1 in hoa, 1 chữ số, 1 kí tự đặc biệc và 8 kí tự."
    ),
  body("confirmPassword").custom((confirmPassword, { req }) => {
    if (confirmPassword != req.body.password) {
      throw new Error("Mật khẩu nhập lại không khớp");
    }
    return true;
  }),
  (req, res, next) => {
    let message = getErrorMessage(req);
    if (message) {
      return res.render("reset-password", { registerMessage: message });
    }
    next();
  },
  controller.resetPassword
);

module.exports = router;
