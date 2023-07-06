"use strict";

const express = require("express");
const router = express.Router();
const controller = require('../controllers/usersController')
const authController = require('../controllers/authController')
const cloudUploadMiddleware = require('../controllers/uploadMiddleware');
const { body, getErrorMessage } = require("../controllers/validator");

const errorMiddleware = (req, res, next) => {
  let message = getErrorMessage(req);
  console.log(message);
  if (message) {
    return res.json(message);
  }
  next();
}

const setSubmissionStatus = (statusId) => {
  return (req, res, next) => {
    req.body.statusId = statusId;
    next();
  }
}

router.use(authController.isLoggedIn)

router.get("/profile", controller.showProfile);
router.post("/profile/update-infos", controller.updateInfomations)

router.get('/editor', controller.showEditor);
router.post('/imgupload', cloudUploadMiddleware, controller.handleUpload);
router.post('/submit-article',
  body(['authorId', 'categories', 'tags', 'title', 'summary', 'thumbnailUrl', 'content']).exists().trim().notEmpty().withMessage('Invalid request!'),
  body('authorId').isInt().withMessage('Invalid user ID!'),
  body('categories').isArray().withMessage('Invalid categories list!'),
  body('tags').isArray().withMessage('Invalid tags list!'),
  errorMiddleware,
  setSubmissionStatus(2),
  controller.handleSubmission
);
router.post('/submit-draft',
  body('authorId').exists().trim().notEmpty().withMessage('Invalid request!').isInt().withMessage('Invalid user ID!'),
  errorMiddleware,
  setSubmissionStatus(1),
  controller.handleSubmission
);

module.exports = router;

