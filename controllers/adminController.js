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
    res.locals.keyword = keyword;

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

controller.showTags = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    console.log("Serach keyword in admin/tags: ", keyword);

    const page = isNaN(req.query.page)
      ? 1
      : Math.max(1, parseInt(req.query.page));

    let options = {
      attributes: ["id", "title"],
      where: {},
      include: [],
      order: [],
      // raw: true,
    };

    if (keyword.trim()) {
      options.where.title = { [Op.like]: `%${keyword}%` };
    }
    res.locals.keyword = keyword;

    res.locals.originalUrl = removeParam("level", req.originalUrl);
    if (Object.keys(req.query).length == 0) {
      res.locals.originalUrl += "?";
    }

    const limit = 10;
    options.limit = limit;
    options.offset = limit * (page - 1);

    const { rows, count } = await models.Tag.findAndCountAll(options);
    res.locals.pagination = {
      page: page,
      limit: limit,
      totalRows: count,
      queryParams: req.query,
    };

    res.locals.manageTags = rows;

    console.log(rows);

    return res.render("admin-tags");
  } catch (error) {
    console.error("Error in /admin/tags controller: ", error);
  }
};

controller.addTag = async (req, res) => {
  try {
    console.log("WE ARE IN addTag!");

    console.log(req.body);

    let { title } = req.body;

    console.log({ title });

    const searchTag = await models.Tag.findOne({ where: { title: title } });
    console.log("Found tag: ", searchTag);
    if (searchTag) {
      return res.json({
        success: false,
        message: "Thêm nhãn thất bại, đã tồn tại nhãn với tên: " + title,
      });
    }

    const newTag = {
      removedAt: null,
      title,
      content: null,
      createdAt: sequelize.literal("NOW()"),
      updatedAt: sequelize.literal("NOW()"),
    };

    const tagDetail = await models.Tag.create(newTag);
    console.log(`\nCreated tag successfully ${tagDetail}\n`);

    res.json({ success: true, message: "Thêm nhãn mới thành công" });
  } catch (error) {
    console.error(error);
  }
};

controller.updateTag = async (req, res) => {
  try {
    const { id, newName } = req.body;

    const tagToUpdate = await models.Tag.findByPk(id);
    console.log("tagToUpdate: ", tagToUpdate);
    if (!tagToUpdate) {
      return res.json({
        success: false,
        message: "Cập nhật nhãn thất bại, không tồn tại nhãn với id: " + tagId,
      });
    }

    if (newName.length < 1) {
      return res.json({
        success: false,
        message:
          "Cập nhật nhãn thất bại, tên nhãn phải có ít nhất 1 kí tự: " +
          newName,
      });
    }

    await models.Tag.update({ title: newName }, { where: { id } });
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
  }
};

controller.deleteTag = async (req, res) => {
  try {
    console.log("WE ARE IN deleteTag!");

    console.log(req.body);
    const tagId = isNaN(req.body.id) ? -2 : Math.max(0, parseInt(req.body.id));

    console.log("Tag to delete: ", tagId);

    const tagToDelete = await models.Tag.findByPk(tagId);
    console.log("tagToDelete: ", tagToDelete);
    if (!tagToDelete) {
      return res.json({
        success: false,
        message: "Xóa nhãn thất bại, không tồn tại nhãn với id: " + tagId,
      });
    }

    const postWithTag = await models.PostTag.findOne({
      where: { tagId },
    });

    if (postWithTag) {
      return res.json({
        success: false,
        message:
          "Xóa nhãn thất bại, vẫn còn bài viết với nhãn, id bài viết " +
          postWithTag.dataValues.postId,
      });
    }

    const result = await models.Tag.destroy({
      where: {
        id: tagId,
      },
    });
    console.log(result);
    res.json({ success: true, message: "Xóa nhãn thành công" });
  } catch (error) {
    console.error(error);
  }
};

controller.showUsers = async (req, res) => {
  try {
    let options = {
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
      where: {},
      include: [],
      order: [],
      // raw: true,
    };

    let userType = parseInt(req.query.userType || 1);
    if (userType > 4 || userType < 1) {
      userType = 1;
    }
    console.log(`\n USER TYPE HERE: ${userType}\n`);
    options.where.typeId = userType;

    const userTypes = await models.UserType.findAll({
      attributes: ["id", "name"],
      raw: true,
    });
    userTypes.forEach((e) => (e.id === userType ? (e.active = true) : false));
    res.locals.userTypes = userTypes;
    if (userType === 3) {
      res.locals.isViewingEditor = "true";
      console.log(`\nisViewingEditor \n`);
    }

    const keyword = req.query.keyword || "";
    console.log("Search keyword in admin/users: ", keyword);

    const page = isNaN(req.query.page)
      ? 1
      : Math.max(1, parseInt(req.query.page));

    if (keyword.trim()) {
      options.where.username = { [Op.like]: `%${keyword}%` };
    }
    res.locals.keyword = keyword;

    res.locals.originalUrl = removeParam("level", req.originalUrl);
    if (Object.keys(req.query).length == 0) {
      res.locals.originalUrl += "?";
    }

    const limit = 10;
    options.limit = limit;
    options.offset = limit * (page - 1);

    const { rows, count } = await models.User.findAndCountAll(options);
    res.locals.pagination = {
      page: page,
      limit: limit,
      totalRows: count,
      queryParams: req.query,
    };

    res.locals.manageUsers = rows;

    console.log(rows);

    return res.render("admin-users");
  } catch (error) {
    console.error("Error in /admin/users controller: ", error);
  }
};

controller.addUser = async (req, res) => {
  try {
    console.log("WE ARE IN addUser!");

    console.log(req.body);

    let { title } = req.body;

    console.log({ title });

    const searchTag = await models.Tag.findOne({ where: { title: title } });
    console.log("Found tag: ", searchTag);
    if (searchTag) {
      return res.json({
        success: false,
        message: "Thêm nhãn thất bại, đã tồn tại nhãn với tên: " + title,
      });
    }

    const newTag = {
      removedAt: null,
      title,
      content: null,
      createdAt: sequelize.literal("NOW()"),
      updatedAt: sequelize.literal("NOW()"),
    };

    const tagDetail = await models.Tag.create(newTag);
    console.log(`\nCreated tag successfully ${tagDetail}\n`);

    res.json({ success: true, message: "Thêm nhãn mới thành công" });
  } catch (error) {
    console.error(error);
  }
};

controller.updateUser = async (req, res) => {
  try {
    const { id, newName } = req.body;

    const tagToUpdate = await models.Tag.findByPk(id);
    console.log("tagToUpdate: ", tagToUpdate);
    if (!tagToUpdate) {
      return res.json({
        success: false,
        message: "Cập nhật nhãn thất bại, không tồn tại nhãn với id: " + tagId,
      });
    }

    if (newName.length < 1) {
      return res.json({
        success: false,
        message:
          "Cập nhật nhãn thất bại, tên nhãn phải có ít nhất 1 kí tự: " +
          newName,
      });
    }

    await models.Tag.update({ title: newName }, { where: { id } });
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
  }
};

controller.updatePremium = async (req, res) => {
  //TODO
  // try {
  //   const { userId, duration } = req.body;

  //   console.log(`Extend premium for userid: ${userId}, duration: ${duration}`);

  //   res.json({ success: true, message: "Cập nhật thành công" });
  // } catch (error) {
  //   console.error(error);
  // }
  const { userId, duration } = req.body;

  let today = new Date();
  let existing_info = await models.PremiumDetails.findOne({ where: { userId: userId }, raw: true });
  if (existing_info) {
    if (existing_info.validUntil > today) {
      await models.PremiumDetails.update({
        validUntil: new Date(existing_info.validUntil.getTime() + 1000 * 60 * 60 * 24 * duration)
      }, {
        where: {
          userId: userId
        }
      })
    }
    else {
      await models.PremiumDetails.update({
        validUntil: new Date(today.getTime() + 1000 * 60 * 60 * 24 * duration)
      }, {
        where: {
          userId: userId
        }
      })
    }
  }
  else {
    await models.PremiumDetails.create({
      userId: userId,
      validUntil: new Date(today.getTime() + 1000 * 60 * 60 * 24 * duration)
    })
  }

  return res.json({ success: true, message: 'Gia hạn thành công' })
};

controller.updateEditor = async (req, res) => {
  try {
    const { userId, manageCategory } = req.body;

    const editorToUpdate = await models.User.findByPk(userId);
    console.log("editorToUpdate: ", editorToUpdate);
    if (!editorToUpdate) {
      return res.json({
        success: false,
        message: "Cập nhật user thất bại, không tồn tại user với id: " + userId,
      });
    } else {
      if (editorToUpdate.dataValues.typeId != 3) {
        return res.json({
          success: false,
          message:
            "Cập nhật editor thất bại, user với id: " +
            userId +
            " không phải là editor",
        });
      }
    }

    const manageCategoryToUpdate = await models.Category.findByPk(
      manageCategory
    );
    if (!manageCategoryToUpdate) {
      return res.json({
        success: false,
        message:
          "Cập nhật editor thất bại, không tồn tại category với id: " +
          manageCategory,
      });
    }

    await models.User.update(
      { managementCategory: manageCategory },
      { where: { id: userId } }
    );
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
  }
};

controller.deleteUser = async (req, res) => {
  try {
    console.log("WE ARE IN deleteTag!");

    console.log(req.body);
    const tagId = isNaN(req.body.id) ? -2 : Math.max(0, parseInt(req.body.id));

    console.log("Tag to delete: ", tagId);

    const tagToDelete = await models.Tag.findByPk(tagId);
    console.log("tagToDelete: ", tagToDelete);
    if (!tagToDelete) {
      return res.json({
        success: false,
        message: "Xóa nhãn thất bại, không tồn tại nhãn với id: " + tagId,
      });
    }

    const postWithTag = await models.PostTag.findOne({
      where: { tagId },
    });

    if (postWithTag) {
      return res.json({
        success: false,
        message:
          "Xóa nhãn thất bại, vẫn còn bài viết với nhãn, id bài viết " +
          postWithTag.dataValues.postId,
      });
    }

    const result = await models.Tag.destroy({
      where: {
        id: tagId,
      },
    });
    console.log(result);
    res.json({ success: true, message: "Xóa nhãn thành công" });
  } catch (error) {
    console.error(error);
  }
};

controller.showPosts = async (req, res) => {
  try {
    let options = {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {},
      include: [],
      order: [],
      // raw: true,
    };

    let postStatus = parseInt(req.query.postStatus || 1);
    if (postStatus > 5 || postStatus < 1) {
      postStatus = 1;
    }
    console.log(`\n POST STATUS HERE: ${postStatus}\n`);
    options.where.statusId = postStatus;

    const postStatuses = await models.PostStatus.findAll({
      attributes: ["id", "name"],
      raw: true,
    });
    postStatuses.forEach((e) =>
      e.id === postStatus ? (e.active = true) : false
    );
    res.locals.postStatuses = postStatuses;
    // if (postStatus === 3) {
    //   res.locals.isViewingEditor = "true";
    //   console.log(`\nisViewingEditor \n`);
    // }

    const keyword = req.query.keyword || "";
    console.log("Search keyword in admin/posts: ", keyword);

    const page = isNaN(req.query.page)
      ? 1
      : Math.max(1, parseInt(req.query.page));

    if (keyword.trim()) {
      options.where.title = { [Op.like]: `%${keyword}%` };
    }
    res.locals.keyword = keyword;

    res.locals.originalUrl = removeParam("level", req.originalUrl);
    if (Object.keys(req.query).length == 0) {
      res.locals.originalUrl += "?";
    }

    const limit = 10;
    options.limit = limit;
    options.offset = limit * (page - 1);

    const { rows, count } = await models.Post.findAndCountAll(options);
    res.locals.pagination = {
      page: page,
      limit: limit,
      totalRows: count,
      queryParams: req.query,
    };

    res.locals.managePosts = rows;

    console.log(rows);

    return res.render("admin-posts-temp");
  } catch (error) {
    console.error("Error in /admin/posts controller: ", error);
  }
};

controller.publishPost = async (req, res) => {
  //TODO
  try {
    const { postId, note } = req.body;

    console.log(`Publish post with id: ${postId}`);

    res.json({ success: true, message: "Xuất bản thành công" });
  } catch (error) {
    console.error(error);
  }
};

controller.denyPost = async (req, res) => {
  //TODO
  try {
    const { postId, denyReason } = req.body;

    console.log(`Deny post with id: ${postId}`);

    res.json({ success: true, message: "Từ chối thành công" });
  } catch (error) {
    console.error(error);
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
