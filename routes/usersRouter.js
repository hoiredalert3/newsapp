"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/usersController");
const authController = require("../controllers/authController");
const cloudUploadMiddleware = require("../controllers/uploadMiddleware");
const { body, getErrorMessage } = require("../controllers/validator");

router.use(authController.isLoggedIn);

router.get("/profile", controller.showProfile);
router.post("/profile", controller.updateInfomations);
router.post("/premium", controller.buyPremium);

router.get("/editor/review", controller.showReview);
// Deny post
router.post("/editor/review/deny", controller.denyPost);
// Accept post
router.post("/editor/review/accept", controller.acceptPost);
// publish post
router.get("/editor/review/publish", controller.showPublish);
router.post("/editor/review/publish", controller.publishPost);
// denied post
router.get("/editor/denied", controller.viewDeniedPost);
// aprroved post
router.get("/editor/approved", controller.viewApprovedPost);

router.get("/editor", controller.showEditor);
router.post("/imgupload", cloudUploadMiddleware, controller.handleUpload);
router.post(
  "/submit-article",
  body([
    "authorId",
    "categories",
    "tags",
    "title",
    "summary",
    "thumbnailUrl",
    "content",
  ])
    .exists()
    .trim()
    .notEmpty()
    .withMessage("Invalid request!"),
  body("authorId").isInt().withMessage("Invalid user ID!"),
  body("categories").isArray().withMessage("Invalid categories list!"),
  body("tags").isArray().withMessage("Invalid tags list!"),
  (req, res, next) => {
    let message = getErrorMessage(req);
    console.log(message);
    if (message) {
      return res.json(message);
    }
    next();
  },
  controller.handleSubmission
);
module.exports = router;
