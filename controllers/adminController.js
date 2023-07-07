"use strict";

const controller = {};
const passport = require("./passport");
const models = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

controller.showDashboard = async (req, res) => {
  try {
    const categoryCount = await models.Category.count({});
    const tagCount = await models.Tag.count({});
    const postCount = await models.Post.count({});
    const userCount = await models.User.count({});

    // console.log(res.locals);
    res.locals.metadata = { categoryCount, tagCount, postCount, userCount };
  } catch (error) {
    console.error(error);
  }

  return res.render("admin-dashboard");
};

controller.showCategories = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const categoryLevel = ["parent", "child"].includes(req.query.level)
      ? req.query.level
      : "parent";

    const page = isNaN(req.query.page)
      ? 1
      : Math.max(1, parseInt(req.query.page));

    let options = {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {},
      include: [],
      order: [],
      // raw: true,
    };

    if (keyword.trim()) {
      options.where.title = { [Op.like]: `%${keyword}%` };
    }

    switch (categoryLevel) {
      case "parent":
        options.where.parentId = null;
        break;
      case "child":
        options.where.parentId = { [Op.not]: null };
        //This throws an error, to fix:
        //  => add Category.belongsTo(models.Category, {as:"parentCategory", foreignKey: "parentId" })
        //     to models/category.js
        // options.include.push({ model: models.Category, as: "ParentCategory" });
        break;
      default:
        options.where.parentId = null;
        break;
    }

    res.locals.originalUrl = removeParam("level", req.originalUrl);
    if (Object.keys(req.query).length == 0) {
      res.locals.originalUrl += "?";
    }

    res.locals.categoryLevel = categoryLevel;

    const limit = 10;
    options.limit = limit;
    options.offset = limit * (page - 1);

    const { rows, count } = await models.Category.findAndCountAll(options);
    res.locals.pagination = {
      page: page,
      limit: limit,
      totalRows: count,
      queryParams: req.query,
    };

    if (categoryLevel === "child") {
      const parentCategories = await models.Category.findAll({
        where: { parentId: null },
        raw: true,
      });
      rows.forEach((row) => {
        row.parentCategory = parentCategories.find(
          (e) => e.id === row.dataValues.parentId
        );
      });
    }

    res.locals.manageCategories = rows;

    // console.log(rows);

    return res.render("admin-categories");
  } catch (error) {
    console.error("Error in /admin/categories controller: ", error);
  }
};

controller.addCategory = async (req, res) => {
  try {
    console.log("WE ARE IN addCategory!");

    console.log(req.body);

    let { parentId, title } = req.body;

    parentId = isNaN(parentId) ? -2 : parseInt(parentId);
    parentId = parentId === -1 ? null : parentId;

    console.log({ parentId, title });

    if (parentId != null) {
      const parentCategory = await models.Category.findByPk(parentId);
      console.log("parentCategory: ", parentCategory);
      if (!parentCategory) {
        return res.json({
          success: false,
          message:
            "Thêm chuyên mục thất bại, không tồn tại chuyên mục cha với id: " +
            parentId,
        });
      }
    }

    const newCategory = {
      removedAt: null,
      parentId,
      title,
      content: null,
      createdAt: sequelize.literal("NOW()"),
      updatedAt: sequelize.literal("NOW()"),
    };

    const categoryDetail = await models.Category.create(newCategory);
    console.log(`\nCreated category successfully ${categoryDetail}\n`);

    res.json({ success: true, message: "Thêm chuyên mục mới thành công" });
  } catch (error) {
    console.error(error);
  }
};

controller.updateCategory = async (req, res) => {
  try {
    const { id, newName } = req.body;

    const categoryToUpdate = await models.Category.findByPk(id);
    console.log("categoryToUpdate: ", categoryToUpdate);
    if (!categoryToUpdate) {
      return res.json({
        success: false,
        message:
          "Cập nhật chuyên mục thất bại, không tồn tại chuyên mục với id: " +
          categoryId,
      });
    }

    await models.Category.update({ title: newName }, { where: { id } });
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
  }
};

controller.deleteCategory = async (req, res) => {
  try {
    console.log("WE ARE IN deleteCategory!");

    console.log(req.body);
    const categoryId = isNaN(req.body.id)
      ? -2
      : Math.max(0, parseInt(req.body.id));
    // await models.Category.update({ title: newName }, { where: { id } });
    console.log("Category to delete: ", categoryId);

    const categoryToDelete = await models.Category.findByPk(categoryId);
    console.log("categoryToDelete: ", categoryToDelete);
    if (!categoryToDelete) {
      return res.json({
        success: false,
        message:
          "Xóa chuyên mục thất bại, không tồn tại chuyên mục với id: " +
          categoryId,
      });
    }

    if (categoryToDelete.dataValues.parentId === null) {
      const oneChildCategory = await models.Category.findOne({
        where: { parentId: categoryId },
        raw: true,
      });

      console.log("Child Category: ", oneChildCategory);
      if (oneChildCategory) {
        return res.json({
          success: false,
          message:
            "Xóa chuyên mục thất bại, vẫn còn chuyên mục con với id: " +
            oneChildCategory.id,
        });
      }
    }

    const postsInCategory = await models.PostCategory.findOne({
      where: { categoryId },
    });

    console.log("Vẫn còn bài viết trong chuyên mục", postsInCategory);
    if (postsInCategory) {
      return res.json({
        success: false,
        message:
          "Xóa chuyên mục thất bại, vẫn còn bài viết trong chuyên mục với id: " +
          postsInCategory.dataValues.postId,
      });
    }

    const result = await models.Category.destroy({
      where: {
        id: categoryId,
      },
    });
    console.log(result);
    res.json({ success: true, message: "Xóa chuyên mục thành công" });
  } catch (error) {
    console.error(error);
  }
};

controller.getParentCategories = async (req, res) => {
  const parentCategories = await models.Category.findAll({
    attributes: ["id", "title", "parentId"],
    where: {
      parentId: null,
    },
    raw: true,
  });
  res.json(parentCategories);
};

function removeParam(key, sourceURL) {
  var rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
  }
  return rtn;
}

module.exports = controller;
