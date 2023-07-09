"use strict";

const models = require("../models");
const Op = require("sequelize").Op;
const fn = require("sequelize").fn;
const sequelize = require("sequelize");
const url = require("url");

// Declare controller
const controller = {};

// Show post
controller.showPosts = async (req, res) => {
	const categoryId = req.query.category ? parseInt(req.query.category) : 0;
	const tagId = req.query.tag ? parseInt(req.query.tag) : 0;
	let options = {
		where: { statusId: 5 },
		include: [],
		order: [["isPremium", "DESC"]],
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
		// console.log("Parent category:");
		// console.log(parentCategory);
		// console.log("Child categories:");
		// console.log(childCategories);

		options.include.push({ model: models.Category, where: { id: categoryId } });
	}
	res.locals.parentCategory = parentCategory;
	res.locals.childCategories = childCategories;

	if (req.query.tag) {
		options.include.push({ model: models.Tag, where: { id: tagId } });
	}

	//Handle sort posts
	let sort = ["newest", "viewed", "hot"].includes(req.query.sort)
		? req.query.sort
		: "newest";
	switch (sort) {
		case "newest":
			options.order.push(["publishedAt", "DESC"]);
			sort = "<b>mới nhất</b>";
			break;
		case "viewed":
			options.order.push(["publishedAt", "DESC"]);
			sort = "<b>lượt xem</b>";
			break;
		case "hot":
			options.order.push(["publishedAt", "DESC"]);
			sort = "<b>nổi bật</b>";
			break;
		default:
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
		options.where.SearchContent = {
			[Op.match]: fn("plainto_tsquery", keyword),
		};

		options.attributes = [
			"id",
			"authorId",
			"title",
			"summary",
			"statusId",
			"publishedAt",
			"removedAt",
			"thumbnailUrl",
			"content",
			"isPremium",
			"createdAt",
			"updatedAt",
			sequelize.literal(
				`ts_rank("SearchContent", plainto_tsquery('english', '${keyword}')) AS "searchScore"`
			),
		];
		options.order.push(sequelize.literal('"searchScore" DESC'));
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
	// console.log(rows[0]);

	res.locals.pagination = {
		page: page,
		limit: limit,
		totalRows: count,
		queryParams: req.query,
	};

	// const posts = await models.Post.findAll(options);
	res.locals.posts = rows;

	// rows.forEach((row) => {
	//   console.log(row.id, row.title, row.searchScore);
	// })

	res.render("post-list-category", {
		premiumMessage: req.query.premiumMessage,
	});
};

// Show search
controller.showPostBySearching = async (req, res) => {
	// Category có query là category, 0/null là tất cả
	// type có 4 kiểu (0-3): tất cả, tiêu đề, tóm tắt, nội dung.
	const options = {
		order: [
			["isPremium", "DESC"],
			["publishedAt", "DESC"]
		],
		where: { statusId: 5 },
		include: [],
		raw: true
	};

	options.attributes = ["id", "authorId", "title", "summary", "statusId", "publishedAt", "removedAt", "thumbnailUrl", "content", "isPremium", "createdAt", "updatedAt"]

	//handle keywords
	let keyword = req.query.keyword || '';
	if (keyword.trim().length > 0) {
		let searchType = req.query.type || 0;
		if (searchType == 0) {
			options.where.SearchContent = {
				[Op.match]: fn("plainto_tsquery", keyword),
			};

			options.attributes.push(sequelize.literal(`ts_rank("SearchContent", plainto_tsquery('english', '${keyword}')) AS "searchScore"`))
			options.order.push(sequelize.literal('"searchScore" DESC'));
		}
		else if (searchType == 1) {
			// search on title
			options.attributes.push(sequelize.literal(`ts_rank(to_tsvector("title"), plainto_tsquery('english', '${keyword}')) AS "searchScore"`))
			options.where.title = {
				[Op.match]: fn("plainto_tsquery", keyword),
			};
			options.order.push(sequelize.literal('"searchScore"'))
		}
		else if (searchType == 2) {
			// search on summary
			options.attributes.push(sequelize.literal(`ts_rank(to_tsvector("summary"), plainto_tsquery('english', '${keyword}')) AS "searchScore"`))
			options.where.summary = {
				[Op.match]: fn("plainto_tsquery", keyword),
			};
			options.order.push(sequelize.literal('"searchScore"'))
		}
		else if (searchType == 3) {
			// search on content
			options.attributes.push(sequelize.literal(`ts_rank(to_tsvector("content"), plainto_tsquery('english', '${keyword}')) AS "searchScore"`))
			options.where.content = {
				[Op.match]: fn("plainto_tsquery", keyword),
			};
			options.order.push(sequelize.literal('"searchScore"'))
		}
	}

	// handle categories
	let category = req.query.category || 0
	if (category > 0) {
		options.include = [{
			model: models.Category,
			where: { id: category }
		}]
	}


	// Handle pagination
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


	res.locals.pagination = {
		page: page,
		limit: limit,
		totalRows: count,
		queryParams: req.query,
	};
	// console.log(count);
	res.locals.total = count;
	res.locals.posts = rows;

	// Lấy Categories 
	const categories = await models.Category.findAll({});
	if (req.query.category == 0) {
		res.locals.categoryAll = true;
	}
	else if (req.query.category > 0 && req.query.category <= categories.length) {
		categories[req.query.category - 1].selected = true;
	}
	categories.forEach((cat) => {
		cat.url = req.originalUrl;
	});

	if (req.query.type == 0) {
		res.locals.type0 = true;
	}
	else if (req.query.type == 1) {
		res.locals.type1 = true;
	}
	else if (req.query.type == 2) {
		res.locals.type2 = true;
	}
	else if (req.query.type == 3) {
		res.locals.type3 = true;
	}

	res.locals.url = req.originalUrl;
	res.locals.keyword = req.query.keyword;
	res.locals.category = req.query.category;
	res.locals.categories = categories;

	return res.render("search");
};
// Show post

async function getCategories(post) {
	try {
		const childCategory = post.Categories[0];
		post.childCategory = childCategory;
		post.parentCategory = await models.Category.findOne({
			where: { id: childCategory.dataValues.parentId },
		});
	} catch (error) {
		console.log(error);
	}
}

controller.showPost = async (req, res, next) => {
	const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
	console.log(`Post id: ${id}`);

	const post = await models.Post.findOne({
		where: { id },
		include: [
			{
				// Parent category
				model: models.Category,
				attributes: ["id", "title", "parentId"],
				where: { parentId: { [Op.not]: null } },
			},
			// Tag
			{
				model: models.Tag,
				attributes: ["id", "title"],
			},
		],
	});

	if (post) {
		// Neu bai viet la premium
		if (post.dataValues.isPremium) {
			const { checkLoggedIn } = require("../controllers/authController");
			// Kiem tra dang nhap hay chua
			if (checkLoggedIn(req, res)) {
				// Kiem tra premium
				const userId = req.user.dataValues.id;
				const premium = await models.PremiumDetails.findOne({
					where: { userId },
					raw: true
				});
				if (!premium || new Date(premium.validUntil) < new Date()) {
					const category = await models.Category.findOne({
						include: [
							{
								model: models.Post,
								where: { id },
							},
						],
						where: {
							parentId: { [Op.not]: null },
						},
					});
					return res.redirect(
						url.format({
							pathname: "/posts",
							query: {
								category: category.dataValues.id,
								premiumMessage: "Bạn cần mua Premium để đọc bài báo này!",
							},
						})
					);
				} else {
					let today = new Date();
					if (today > premium.validUntil)
						return res.redirect(
							url.format({
								pathname: "/posts",
								query: {
									category: category.dataValues.id,
									premiumMessage: "Bạn cần gia hạn Premium để đọc bài báo này!",
								},
							})
						);
				}
			}
		}

		// Tang view + hot
		// get statistic
		const postStat = await models.PostStatistic.findOne({
			where: { postId: id },
		});

		// console.log(postStat);
		// console.log(parseInt(postStat.dataValues.views) + 1);
		// Update Post statistic
		await models.PostStatistic.update(
			{
				views: parseInt(postStat.dataValues.views) + 1,
				hot: parseInt(postStat.dataValues.hot) + 1,
			},
			{
				where: { postId: id },
			}
		);
		getCategories(post);

		const relevantPosts = await models.Post.findAll({
			include: [
				{
					model: models.Category,
					where: { id: post.childCategory.dataValues.id },
				},
			],
			order: [["publishedAt", "DESC"]],
			limit: 6,
		});
		relevantPosts.forEach((post) => {
			post.category = post.Categories[0];
		});

		// Get comment
		const comments = await models.PostComment.findAll({
			include: [
				{
					model: models.User,
					attributes: ["name"],
				},
			],
			where: {
				postId: id,
			},
		});

		res.locals.post = post;
		res.locals.user = req.user;
		res.locals.relevantPosts = relevantPosts;
		res.locals.comments = comments;

		return res.render("post-detail", {
			commentSuccess: req.query.commentSuccess,
			commentFailed: req.query.commentFailed,
		});
	}
	return res.redirect("/404");
};

controller.postComment = async (req, res) => {
	try {
		const userId = req.user.dataValues.id;
		const cmt = await models.PostComment.create({
			userId,
			postId: req.body.postId,
			parentId: null,
			content: req.body.content,
			publishedAt: new Date(),
			statusId: 1,
		});
		if (cmt) {
			return res.redirect(
				`/posts/${req.body.postId}?commentSuccess=Đăng%20bình%20luận%20thành%20công#comments`
			);
		} else {
			return res.redirect(
				url.format({
					pathname: `posts/${req.body.postId}`,
					query: {
						commentFailed: "Đăng bình luận thất bại, vui lòng thử lại",
					},
				})
			);
		}
	} catch (e) {
		return res.redirect(
			url.format({
				pathname: `posts/${req.body.postId}`,
				query: {
					commentFailed:
						"Đã có lỗi trong quá trình đăng bình luận, vui lòng thử lại...",
				},
			})
		);
	}
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
