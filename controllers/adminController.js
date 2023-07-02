"use strict";

const controller = {};
const passport = require("./passport");
const models = require("../models");
const Op = require("sequelize").Op;

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

    res.locals.categories = rows;

    // console.log(rows);

    return res.render("admin-categories");
  } catch (error) {
    console.error("Error in /admin/categories controller: ", error);
  }
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
