"use strict";

const express = require("express");
const router = express.Router();
const controller = require('../controllers/usersController')
const authController = require('../controllers/authController')
const cloudUploadMiddleware = require('../controllers/uploadMiddleware');
const { body, getErrorMessage } = require("../controllers/validator");


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
    body('tags.*').isAlphanumeric().withMessage('Some tags are inappropriate!'),
    (req, res, next) => {
        let message = getErrorMessage(req);
        console.log(message);
        if (message) {
            return res.json(message);
        }
        next();
    },
    controller.handleSubmission);
module.exports = router;
