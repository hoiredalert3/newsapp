"use strict";
const models = require("../models");
const controller = {};

controller.showProfile = async (req, res) => {
  const user = req.user;
  const typeId = user.dataValues.typeId;
  if (typeId == 2) {
    user.writer = true;
  } else if (typeId == 3) {
    user.editor = true;
    // Lay chuyen muc quan ly
    try {
      const category = await models.Category.findOne({
        where: { id: user.dataValues.categoryManagement },
      });
      console.log(category);
      if (category != null) {
        user.categoryName = category.dataValues.title;
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (user.writer) {
    try {
      
    } catch (error) {
      console.log(error);
    }
  } else if (user.editor) {
    try {
      // const yetApprovedPosts = await models.Post.findAll({
      //   attributes: ["id", "title", "summary"],
      //   where: {
      //     authorId: user.dataValues.id,
      //     statusId: 2
      //   },
      //   order: [["publishedAt", "DESC"]]
      // });
    } catch (error) {
      console.log(error);
    }
  }

  res.locals.user = user;
  res.render("profile");
};

module.exports = controller;
