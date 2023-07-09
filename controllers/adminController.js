"use strict";

const controller = {};
const passport = require("./passport");
const models = require("../models");
const sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const Op = sequelize.Op;

const url = require("url");

function age(birthdate) {
  const today = new Date();
  const age =
    today.getFullYear() -
    birthdate.getFullYear() -
    (today.getMonth() < birthdate.getMonth() ||
      (today.getMonth() === birthdate.getMonth() &&
        today.getDate() < birthdate.getDate()));
  return age;
}

function getComment(cmt) {
  return cmt.trim() == "" || cmt === null || cmt === undefined
    ? "Ok."
    : cmt.trim();
}

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
    if (
      Object.keys(req.query).length == 0 ||
      res.locals.originalUrl == "/admin/categories"
    ) {
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
    if (
      Object.keys(req.query).length == 0 ||
      res.locals.originalUrl == "/admin/tags"
    ) {
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

    switch (userType) {
      case 1:
        res.locals.isViewingReader = "true";
        break;
      case 2:
        res.locals.isViewingWriter = "true";
        break;
      case 3:
        res.locals.isViewingEditor = "true";
        break;
      case 4:
        res.locals.isViewingAdmin = "true";
        break;
      default:
        break;
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

    res.locals.originalUrl = removeParam("userType", req.originalUrl);
    if (
      Object.keys(req.query).length == 0 ||
      res.locals.originalUrl == "/admin/users"
    ) {
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

    let { username, name, email, managementCategory, password, typeId } =
      req.body;

    let user_by_username = await models.User.findOne({
      where: { username },
    });
    let user_by_email = await models.User.findOne({
      where: { email },
    });

    if (user_by_username) {
      return res.json({
        success: false,
        message: "Username đã bị sử dụng: " + username,
      });
    }

    if (user_by_email) {
      return res.json({
        success: false,
        message: "Email đã bị sử dụng: " + email,
      });
    }

    typeId = parseInt(typeId);
    if (typeId > 4 || typeId < 1) {
      typeId = 1;
    }

    if (typeId === 3 && !managementCategory) {
      managementCategory = 1;
    }

    let user = await models.User.create({
      username,
      name,
      email,
      dob: new Date(),
      pseudonym: null,
      managementCategory,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
      typeId,
      createdAt: sequelize.literal("NOW()"),
      updatedAt: sequelize.literal("NOW()"),
    });

    console.log(`\nCreated user successfully ${user}\n`);

    res.json({ success: true, message: "Thêm người dùng thành công" });
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
  let existing_info = await models.PremiumDetails.findOne({
    where: { userId: userId },
    raw: true,
  });
  if (existing_info) {
    if (existing_info.validUntil > today) {
      await models.PremiumDetails.update(
        {
          validUntil: new Date(
            existing_info.validUntil.getTime() + 1000 * 60 * 60 * 24 * duration
          ),
        },
        {
          where: {
            userId: userId,
          },
        }
      );
    } else {
      await models.PremiumDetails.update(
        {
          validUntil: new Date(
            today.getTime() + 1000 * 60 * 60 * 24 * duration
          ),
        },
        {
          where: {
            userId: userId,
          },
        }
      );
    }
  } else {
    await models.PremiumDetails.create({
      userId: userId,
      validUntil: new Date(today.getTime() + 1000 * 60 * 60 * 24 * duration),
    });
  }

  return res.json({ success: true, message: "Gia hạn thành công" });
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
    console.log("WE ARE IN deleteUser!");

    console.log(req.body);
    const userId = isNaN(req.body.id) ? -2 : Math.max(0, parseInt(req.body.id));

    console.log("Id of User to delete: ", userId);

    const userToDelete = await models.User.findByPk(userId);
    console.log("userToDelete: ", userToDelete);
    if (!userToDelete) {
      return res.json({
        success: false,
        message:
          "Xóa người dùng thất bại, không tồn tại người dùng với id: " + userId,
      });
    }

    if (userToDelete.dataValues.typeId != 1) {
      return res.json({
        success: false,
        message:
          "Xóa người dùng thất bại, không thể xóa Writer/Editor/Admin với id: " +
          userId,
      });
    }

    try {
      console.log(models.PremiumDetail, models.OTP, models.PostComment);
      const preDelete = await Promise.all([
        models.PremiumDetails.destroy({
          where: {
            userId,
          },
        }),
        models.OTP.destroy({
          where: {
            userId,
          },
        }),
        models.PostComment.destroy({
          where: {
            userId,
          },
        }),
      ]);

      const result = await models.User.destroy({
        where: {
          id: userId,
        },
      });
      console.log(result);
      return res.json({ success: true, message: "Xóa người dùng thành công" });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: "Xóa người dùng thất bại, lỗi: " + error,
      });
    }
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

    res.locals.originalUrl = removeParam("postStatus", req.originalUrl);
    if (
      Object.keys(req.query).length == 0 ||
      res.locals.originalUrl == "/admin/posts"
    ) {
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

    rows.forEach((post) => {
      if (post.dataValues.statusId == 1) {
        post.draft = true;
      } else if (post.dataValues.statusId == 2) {
        post.unapp = true;
      }
      if (post.dataValues.statusId == 3) {
        post.rejected = true;
      }
      if (post.dataValues.statusId == 4 || post.dataValues.statusId == 5) {
        post.published = true;
      }
    });
    res.locals.managePosts = rows;

    console.log(rows);

    return res.render("admin-posts-temp");
  } catch (error) {
    console.error("Error in /admin/posts controller: ", error);
  }
};

controller.deletePost = async (req, res) => {
  try {
    console.log("WE ARE IN deletePost!");

    console.log(req.body);
    const postId = isNaN(req.body.id) ? -2 : Math.max(0, parseInt(req.body.id));

    console.log("Id of post to delete: ", postId);

    const postToDelete = await models.Post.findByPk(postId);
    console.log("postToDelete: ", postToDelete);
    if (!postToDelete) {
      return res.json({
        success: false,
        message: "Xóa bài viết thất bại, không tồn tại bài viết với id: " + postId,
      });
    }

    const result = await models.Post.destroy({
      where: {
        id: postId,
      },
    });
    console.log(result);
    res.json({ success: true, message: "Xóa bài viết thành công" });
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

controller.viewPost = async (req, res) =>{
  const post = await models.Post.findOne({
		include: [
			{
				model: models.Category,
				attributes: ["id", "title"],
				where: { parentId: { [Op.not]: null } },
			},
			{
				model: models.Tag,
				attributes: ["id", "title"],
			},
		],
		where: { id: req.query.id },
	});
	post.category = post.dataValues.Categories[0];
	post.tags = post.dataValues.Tags;
	return res.render("article-review", { post });
}

controller.viewDraftPost = async (req, res) => {
	const post = await models.Post.findOne({
		where: {
			id: req.query.id,
			statusId: 1,
		},
		include: [
			{
				model: models.Category,
				where: { parentId: { [Op.not]: null } },
			},
			{
				model: models.Tag,
			},
		],
	});

	post.tags = post.dataValues.Tags;
	post.category = post.dataValues.Categories[0];
	res.locals.post = post;

	return res.render("view-draft-post-admin");
};

controller.showReviewPost = async (req, res) =>{
  const post = await models.Post.findOne({
		include: [
			{
				model: models.Category,
				attributes: ["id", "title"],
				where: { parentId: { [Op.not]: null } },
			},
			{
				model: models.Tag,
				attributes: ["id", "title"],
			},
		],
		where: { id: req.query.id },
	});
	post.category = post.dataValues.Categories[0];
	post.tags = post.dataValues.Tags;
	return res.render("admin-review-post", { post });
}

controller.viewPublishedPost = async (req, res) => {
	const post = await models.Post.findOne({
		where: {
			id: req.query.id,
			[Op.or]: [{ statusId: 4 }, { statusId: 5 }],
		},
		include: [
			{
				model: models.ApprovedPost
			},
			{
				model: models.Category,
				where: { parentId: { [Op.not]: null } },
			},
			{
				model: models.Tag,
			},
		],
	});
	console.log(post);
	post.approvedInfo = post.dataValues.ApprovedPost;
	post.tags = post.dataValues.Tags;
	post.category = post.dataValues.Categories[0];
	res.locals.post = post;

	return res.render("admin-view-post");
};

controller.denyPost = async (req, res) => {
  await models.Post.update({ statusId: 3 }, { where: { id: req.body.postId } });
	await models.ApprovedPost.destroy({ where: { postId: req.body.postId } });

	const denPost = await models.RejectedPost.create({
		postId: req.body.postId,
		reviewerId: req.user.dataValues.id,
		reviewedAt: new Date(),
		categoryComment: getComment(req.body.categoryComment),
		tagComment: getComment(req.body.tagComment),
		titleComment: getComment(req.body.titleComment),
		abstractComment: getComment(req.body.summaryComment),
		contentComment: getComment(req.body.contentComment),
	});

	//console.log(denPost);
	return res.redirect(
		url.format({
			pathname: "/admin/posts",
			query: {
        postStatus: 3,
				rejectPost: `Bạn đã từ chối bài viết ${req.body.postId}.`,
			},
		})
	);
};

controller.viewDeniedPost = async (req, res) => {
	const post = await models.Post.findOne({
		where: {
			id: req.query.id,
			statusId: 3,
		},
		include: [
			{
				model: models.RejectedPost,
			},
			{
				model: models.Category,
				where: { parentId: { [Op.not]: null } },
			},
			{
				model: models.Tag,
			},
		],
	});
	console.log(post);
	post.rejectedInfo = post.dataValues.RejectedPosts[0];
	post.tags = post.dataValues.Tags;
	post.category = post.dataValues.Categories[0];
	res.locals.post = post;
	return res.render("denied-post-admin");
};

controller.acceptPost = async (req, res) => {
	// Update post
	await models.Post.update({ statusId: 4 }, { where: { id: req.body.postId } });

	// Create approved post
	let now = new Date();
	let now1hour = new Date();
	now1hour.setTime(now1hour.getTime() + 1 * 60 * 60 * 1000);
	console.log(req.user.dataValues.id);
	let [appPost, created] = await models.ApprovedPost.findOrCreate({
		where: {
			postId: req.body.postId,
		},
		defaults: {
			approverId: req.user.dataValues.id,
			approvedAt: now,
			publishAt: now1hour, // 1 gio sau
			isPublished: false,
		},
	});

	// console.log(appPost);

	return res.redirect(
		url.format({
			pathname: "/admin/reviewPost/publish",
			query: {
				id: req.query.id,
				appPostId: appPost.dataValues.id,
			},
		})
	);
};

controller.showPublish = async (req, res) => {
	let appPost;
	try {
		appPost = await models.ApprovedPost.findOne({
			where: { id: req.query.appPostId, postId: req.query.id },
		});
		console.log(appPost);
		if (appPost) {
			const post = await models.Post.findOne({
				include: [
					{
						model: models.Category,
						attributes: ["id", "title"],
						where: { parentId: { [Op.not]: null } },
					},
					{
						model: models.Tag,
						attributes: ["id", "title"],
					},
				],
				where: { id: req.query.id },
			});

			res.locals.category = post.dataValues.Categories[0];
			res.locals.tags = post.dataValues.Tags;

			res.locals.id = req.query.id;
			res.locals.appPostId = req.query.appPostId;

			return res.render("publish-article-admin", { error: req.query.error });
		} else {
			return res.render("error", { message: "File not Found!" });
		}
	} catch (e) {
		console.log(e);
		return res.render("error", { message: "File not Found!" });
	}
};

controller.publishPost =  async (req, res) => {
	let publishDate = new Date(req.body.publishDay + " " + req.body.publishTime);
	let now = new Date();
	if ((now - publishDate) / 1000 > 60) {
		return res.redirect(
			url.format({
				pathname: "/admin/reviewPost/publish",
				query: {
					error: "Thời điểm xuất bản không hợp lệ",
					id: req.body.id,
					appPostId: req.body.appPostId,
				},
			})
		);
	}

	await models.ApprovedPost.update(
		{ publishAt: publishDate },
		{ where: { id: req.body.appPostId } }
	);

	return res.redirect(
		url.format({
			pathname: "/admin/posts",
			query: {
        postStatus: 4,
				publishMessage: "Xuất bản bài viết thành công",
			},
		})
	);
};
module.exports = controller;
