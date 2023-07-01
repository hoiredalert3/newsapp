"use strict";

const models = require("../models");
const Op = require("sequelize").Op;

// Declare controller
const controller = {};

// Show post
controller.showPosts = async (req, res) => {
  const categoryId = req.query.category ? parseInt(req.query.category) : 0;

  let options = {
    where: {},
    include: [],
    order: [],
    raw: true,
  };

  let parentCategory;
  let childCategories = [];
  if (categoryId > 0) {
    const category = await models.Category.findOne({
      where: { id: categoryId },
      raw: true,
    });

    //Neu category la chuyen muc cap 1, can tim cac chuyen muc cap 2
    if (category.parentId === null) {
      parentCategory = category;
      childCategories = await models.Category.findAll({
        where: { parentId: categoryId },
        raw: true,
      });
    } else {
      //Neu category la chuyen muc cap 2
      parentCategory = await models.Category.findOne({
        where: { id: category.parentId },
        raw: true,
      });
      childCategories = await models.Category.findAll({
        where: { parentId: parentCategory.id },
        raw: true,
      });
      childCategories.forEach((child) => {
        child.id == category.id ? (child.active = true) : false;
      });
    }
    console.log("Parent category:");
    console.log(parentCategory);
    console.log("Child categories:");
    console.log(childCategories);

    options.include.push({ model: models.Category, where: { id: categoryId } });
  }
  res.locals.parentCategory = parentCategory;
  res.locals.childCategories = childCategories;

  //Handle sort posts
  const sort = ["newest", "popular"].includes(req.query.sort)
    ? req.query.sort
    : "newest";
  switch (sort) {
    case "newest":
      options.order.push(["createdAt", "DESC"]);
      break;
    case "popular":
      options.order.push(["createdAt", "DESC"]);
      break;
    default:
      options.order.push(["createdAt", "DESC"]);
      break;
  }
  res.locals.originalUrl = removeParam("sort", req.originalUrl);
  if (Object.keys(req.query).length == 0) {
    res.locals.originalUrl += "?";
  }
  res.locals.sort = sort;

  //Handle search for keyword
  const keyword = req.query.keyword || "";
  if (keyword.trim()) {
    options.where.title = { [Op.like]: `%${keyword}%` };
  }
  if (categoryId <= 0) {
    options.include.push({
      model: models.Category,
      where: { parentId: { [Op.not]: null } },
    });
  }

  //Handle pagination
  const page = isNaN(req.query.page)
    ? 1
    : Math.max(1, parseInt(req.query.page));
  const limit = 8;
  options.limit = limit;
  options.offset = limit * (page - 1);

  const { rows, count } = await models.Post.findAndCountAll(options);

  rows.forEach((row) => {
    row.CategoryId = row["Categories.id"];
    row.CategoryTitle = row["Categories.title"];
  });
  console.log(rows[0]);

  res.locals.pagination = {
    page: page,
    limit: limit,
    totalRows: count,
    queryParams: req.query,
  };

  const posts = await models.Post.findAll(options);
  res.locals.posts = rows;

  // console.log(rows);

  res.render("post-list-category");
};

// Show post
controller.showPost = async (req, res) => {
  const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

  console.log(`Post id: ${id}`);

  const post = await models.Post.findOne({
    where: { id },
    include: [],
  });
  if (post) {
    console.log(post.dataValues);
    res.locals.post = post;

    return res.render("post-detail");
  }
  res.redirect("/404");
};

// Show post
controller.showOriginalPost = async (req, res) => {
  res.render("post");
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
