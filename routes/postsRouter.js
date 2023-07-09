"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/postsController");

router.get("/", controller.showPosts);
router.get("/search", controller.showPostBySearching);
router.post("/comments", controller.postComment);

router.get("/original", controller.showOriginalPost);

router.get("/:id", controller.showPost);


module.exports = router;
