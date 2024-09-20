"use strict";
const { contextsKey } = require("express-validator");
const models = require("../models");
const { create } = require("express-handlebars");
const Op = require("sequelize").Op;
const controller = {};
const url = require("url");
const { type } = require("os");

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

controller.showProfile = async (req, res) => {
	const user = req.user;
	const typeId = user.dataValues.typeId;
	const userId = user.dataValues.id;

	// check premium
	if (typeId == 1) {
		let info = await models.PremiumDetails.findOne({ where: { userId: userId }, raw: true })
		if (info) {
			let today = new Date()
			if (info.validUntil > today)
				res.locals.premium = info
		}
	}

	if (typeId == 2) {
		user.writer = true;
	} else if (typeId == 3) {
		user.editor = true;
		// Lay chuyen muc quan ly
		try {
			const category = await models.Category.findOne({
				where: { id: user.dataValues.managementCategory },
			});

			if (category) {
				user.categoryName = category.dataValues.title;
			}
		} catch (error) {
			console.log(error);
		}
	}
	else if(typeId == 4){
		user.admin =true;
	}

	if (user.writer) {
		try {
			let draftedPosts = null;
			let rejectedPosts = null;
			let unappPosts = null;
			let appPosts = null;

			// Options
			let options = {
				attributes: [
					"id",
					"title",
					"summary",
					"thumbnailUrl",
					"createdAt",
					"updatedAt",
					"authorId",
					"statusId",
				],
				where: {
					authorId: userId,
				},
				include: [
					{
						model: models.Category,
						attributes: ["id", "title"],
					},
					{
						model: models.Tag,
						attributes: ["id", "title"],
					},
				],
				order: [["updatedAt", "DESC"]],
			};

			options.where.statusId = 1;
			draftedPosts = await models.Post.findAll(options);

			options.where.statusId = 3;
			rejectedPosts = await models.Post.findAll(options);

			options.where.statusId = 2;
			unappPosts = await models.Post.findAll(options);

			options.where = {
				[Op.or]: [{ statusId: 4 }, { statusId: 5 }],
				authorId: userId,
			};
			appPosts = await models.Post.findAll(options);

			res.locals.draftedPosts = draftedPosts;
			res.locals.rejectedPosts = rejectedPosts;
			res.locals.unappPosts = unappPosts;
			res.locals.appPosts = appPosts;
		} catch (error) {
			console.log(error);
		}
	} else if (user.editor) {
		try {
			// Lấy những bài post thuộc chuyên mục mình quản lý
			const cat_man = user.dataValues.managementCategory;
			const cat1 = await models.Category.findOne({
				attributes: ["id", "parentId"],
				where: {
					id: cat_man,
				},
			});
			//
			let yetUnapprovedPosts = null;
			let deniedPosts = null;
			let approvedPosts = null;
			let draftedPosts = null;

			// Options
			let options = {
				attributes: [
					"id",
					"title",
					"summary",
					"thumbnailUrl",
					"createdAt",
					"updatedAt",
					"authorId",
					"statusId",
				],
				where: {},
				include: [
					{
						model: models.User,
						attributes: ["id", "pseudonym"],
					},
				],
				order: [["updatedAt", "DESC"]],
			};

			if (cat1.dataValues.parentId != null) {
				options.include.push({
					model: models.Category,
					where: {
						id: cat_man,
					},
				});
			} else {
				options.include.push({
					model: models.Category,
					where: {
						parentId: cat_man,
					},
				});
			}
			options.include.push({
				model: models.Tag,
			});

			options.where.statusId = 2;
			yetUnapprovedPosts = await models.Post.findAll(options);
			yetUnapprovedPosts.forEach((post) => {
				post.tags = post.dataValues.Tags;
			});

			// Lấy các bài viết đã duyệt
			let app_options = Object.assign({}, options);
			app_options.include.push({
				model: models.ApprovedPost,
				where: {
					approverId: userId,
				},
			});

			app_options.where = { [Op.or]: [{ statusId: 4 }, { statusId: 5 }] };
			// console.log(app_options)
			approvedPosts = await models.Post.findAll(app_options);
			approvedPosts.forEach((post) => {
				post.tags = post.dataValues.Tags;
			});

			// Lấy các bài viết mình từ chối
			let den_options = Object.assign({}, options);
			den_options.include.pop();
			den_options.include.push({
				model: models.RejectedPost,
				where: {
					reviewerId: userId,
				},
			});
			den_options.where.statusId = 3;
			console.log(den_options);
			deniedPosts = await models.Post.findAll(den_options);
			deniedPosts.forEach((post) => {
				post.tags = post.dataValues.Tags;
			});

			// Lấy các bài nhap
			options.where.statusId = 1;
			options.include.pop();

			draftedPosts = await models.Post.findAll(options);
			draftedPosts.forEach((post) => {
				post.tags = post.dataValues.Tags;
			});

			res.locals.yetUnapprovedPosts = yetUnapprovedPosts;
			res.locals.approvedPosts = approvedPosts;
			res.locals.deniedPosts = deniedPosts;
			res.locals.draftedPosts = draftedPosts;
		} catch (error) {
			console.log(error);
		}
	}

	res.locals.user = user;
	res.locals.successMessage = req.query.successMessage;
	res.locals.failedMessage = req.query.failedMessage;
	res.locals.rejectPost = req.query.rejectPost;

	return res.render("profile");
};

controller.updateInfomations = async (req, res) => {
	const user = req.user;
	const email = req.body.email;
	const user_email = await models.User.findOne({
		attributes: ["id", "email"],
		where: { email },
	});
	const user_type = user.dataValues.typeId;
	if (user_email) {
		if (user_email.dataValues.id != user.dataValues.id) {
			return res.redirect(
				url.format({
					pathname: "/users/profile",
					query: {
						failedMessage: "Email đã có người sử dụng!",
					},
				})
			);
		}
	}
	let pseudonym = null;
	let password = req.body.password;
	let dob = req.body.dob;
	if (user_type == 2) {
		pseudonym = req.body.pseudonym;
	}
	if (password == "") {
		password = user.dataValues.password;
	} else {
		let bcrypt = require("bcrypt");
		password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
	}
	if (age(new Date(dob)) < 13) {
		return res.redirect(
			url.format({
				pathname: "/users/profile",
				query: {
					failedMessage: "Người dùng phải trên 13 tuổi",
				},
			})
		);
	}

	await models.User.update(
		{
			name: req.body.fullname,
			email,
			dob,
			pseudonym,
			password,
		},
		{ where: { id: user.dataValues.id } }
	);

	return res.redirect(
		url.format({
			pathname: "/users/profile",
			query: {
				successMessage: "Cập nhật thành công!",
			},
		})
	);
};

controller.registerPremium = async (req, res) => {
	let userId = req.user.id || 0
	if (!userId)
		return res.render("signin", {
			layout: false,
			loginMessage: 'Please login first!',
			sitekey: process.env.CAPTCHA_SITE_KEY
		});

	let days = req.body.days ? parseInt(req.body.days) : 7;

	let today = new Date();
	let existing_info = await models.PremiumDetails.findOne({ where: { userId: userId }, raw: true });
	if (existing_info) {
		if (existing_info.validUntil > today) {
			await models.PremiumDetails.update({
				validUntil: new Date(existing_info.validUntil.getTime() + 1000 * 60 * 60 * 24 * days)
			}, {
				where: {
					userId: userId
				}
			})
		}
		else {
			await models.PremiumDetails.update({
				validUntil: new Date(today.getTime() + 1000 * 60 * 60 * 24 * days)
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
			validUntil: new Date(today.getTime() + 1000 * 60 * 60 * 24 * days)
		})
	}
	return res.redirect('/users/profile');

};

async function getCategories() {
	// get categories
	let categories_raw = await models.Category.findAll({
		attributes: ["id", "parentId", "title"],
		where: {
			removedAt: {
				[Op.is]: null,
			},
		},
		raw: true,
	});
	let categories = [];
	categories_raw.forEach((category) => {
		if (category.parentId == null)
			categories.push({
				category: {
					id: category.id,
					title: category.title,
				},
				sub_categories: [],
			});
	});
	categories_raw.forEach(async (category) => {
		if (category.parentId != null) {
			let idx = await categories.findIndex(
				({ category: { id } }) => id == category.parentId
			);
			if (idx >= 0)
				categories[idx].sub_categories.push({
					sub_id: category.id,
					sub_title: category.title,
				});
		}
	});
	return categories;
}
controller.showEditor = async (req, res, next) => {
	res.locals.userId = req.user.id;
	let editorCategories = await getCategories();
	console.log(res.locals.editorCategories);
	let id = null;
	let statusId = null;
	var rejectedPost = false;
	// Hieu chinh nhap
	if (req.query.draftId) {
		id = req.query.draftId;
		statusId = 1;
	}
	// Hieu chinh chua duyet
	else if (req.query.unappId) {
		id = req.query.unappId;
		statusId = 2;
	}
	else if (req.query.rejectedId) {
		id = req.query.rejectedId;
		rejectedPost = true;
		statusId = 3;
	}

	if (id) {
		try {
			const post = await models.Post.findOne({
				where: {
					id,
					statusId,
				},
				include: [
					{
						model: models.Tag,
					},
					{
						model: models.Category,
						where: {
							parentId: { [Op.not]: null },
						},
					},
				],
			});

			// Lay category
			let catParentId = post.Categories[0].dataValues.parentId;
			let catChildId = post.Categories[0].dataValues.id;
			editorCategories.forEach((parent) => {
				if (parent.category.id == catParentId) {
					parent.sub_categories.forEach((child) => {
						if (child.sub_id == catChildId) {
							child.selected = true;
						}
					});
				}
			});
			// console.log(editorCategories)

			if (rejectedPost) {
				const rpost = await models.RejectedPost.findOne({ where: { postId: id } });
				res.locals.catCmt = rpost.dataValues.categoryComment;
				res.locals.tagCmt = rpost.dataValues.tagComment;
				res.locals.titleCmt = rpost.dataValues.titleComment;
				res.locals.absComment = rpost.dataValues.abstractComment;
				res.locals.contentCmt = rpost.dataValues.contentComment;
				res.locals.rejectedPost = true;
			}

			res.locals.title = post.dataValues.title;
			res.locals.summary = post.dataValues.summary;
			res.locals.content = post.dataValues.content;
			res.locals.tags = post.Tags;

			// Hieu chinh nhap
			if (req.query.draftId) {
				res.locals.draftId = id;
				console.log(res.locals.draftId);
			}
			// Hieu chinh chua duyet
			else if (req.query.unappId) {
				res.locals.unappId = id;
				console.log(res.locals.unappId);
			}
			else if (req.query.rejectedId) {
				res.locals.rejectedId = id;
				console.log(res.locals.rejectedId);
			}
		} catch (e) {
			return res.redirect(
				url.format({
					pathname: "/users/profile",
					query: {
						failedMessage:
							"Có gì đó đã xảy ra trong quá trình mở bài nháp, vui lòng thử lại...",
					},
				})
			);
		}
	}

	res.locals.editorCategories = editorCategories;
	res.render("editor", { layout: false });
};

controller.handleUpload = (req, res, next) => {
	// console.log('upload called');
	// console.log(req.file);

	if (req.file) return res.json({ location: req.file.path });

	res.json({
		location:
			"https://nextdoorsec.com/wp-content/uploads/2022/12/Sorry-Something-Went-Wrong.png",
	});
};

async function registerTag(tag) {
	let [row, created] = await models.Tag.findOrCreate({
		where: {
			title: {
				[Op.like]: tag,
			},
		},
		defaults: {
			title: tag,
		},
	});

	//console.log(`Register Tag returning: ${row.id}`);
	return row.id;
}

async function registerTags(tags) {
	let promises = tags.map((tag) => registerTag(tag));
	let result = await Promise.all(promises);
	return result;
}

controller.handleSubmission = async (req, res, next) => {
	const authorId = req.body.authorId;
	if (req.user.id != authorId || req.user.typeId != 2)
		return { ok: false, message: "Unauthorized" };
	let post = null;
	// Draft post
	if (req.body.draftId) {
		await models.Post.destroy({
			where: { id: req.body.draftId, statusId: 1 },
		});
	}
	// Unaproved post
	else if (req.body.unappId) {
		post = await models.Post.findOne({
			where: { id: req.body.unappId, statusId: 2 },
		});
		await post.update({
			title: req.body.title,
			summary: req.body.summary,
			thumbnailUrl: req.body.thumbnailUrl,
			content: req.body.content,
		});
		await post.save();
		await models.PostCategory.destroy({ where: { postId: req.body.unappId } });
		await models.PostTag.destroy({ where: { postId: req.body.unappId } });
	}
	else if (req.body.rejectedId) {
		await models.RejectedPost.destroy({
			where: { postId: req.body.rejectedId },
		});
		await models.Post.destroy({
			where: { id: req.body.rejectedId },
		});
	}

	if (post == null) {
		// register post
		post = await models.Post.create({
			authorId: authorId,
			title: req.body.title,
			summary: req.body.summary,
			statusId: req.body.statusId,
			publishedAt: null,
			removedAt: null,
			thumbnailUrl: req.body.thumbnailUrl,
			content: req.body.content,
			isPremium: false,
		});
		//console.log(`Registered post ${post}`)
	}

	let tagInsertPromises = null;
	if (req.body.tags.length > 0) {
		const tags = req.body.tags.map((value) => value.trim().toUpperCase());
		let tag_idxs = await registerTags(tags);
		// register post's tags
		tagInsertPromises = tag_idxs.map(async (tag) =>
			await models.PostTag.findOrCreate({
				where: {
					postId: post.id,
					tagId: tag,
				},
				default: {
					postId: post.id,
					tagId: tag,
				},
			})
		);
	}

	// register post's categories
	let categories = req.body.categories;
	console.log(categories);
	let catInsertPromises = categories.map(async (cat) =>
		await models.PostCategory.findOrCreate({
			where: {
				postId: post.id,
				categoryId: cat,
			},
			default: {
				postId: post.id,
				categoryId: cat,
			},
		})
	);

	if (tagInsertPromises != null)
		await Promise.all(tagInsertPromises, catInsertPromises);
	else await catInsertPromises;
	res.json({ completed: true });
	//res.json(tags_idx);
};

controller.showReview = async (req, res) => {
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
};

function getComment(cmt) {
	return cmt.trim() == "" || cmt === null || cmt === undefined
		? "Ok."
		: cmt.trim();
}
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

	console.log(denPost);
	return res.redirect(
		url.format({
			pathname: "/users/profile",
			query: {
				rejectPost: `Bạn đã từ chối bài viết ${req.body.postId}.`,
			},
		})
	);
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
			pathname: "/users/editor/review/publish",
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

			return res.render("publish-article", { error: req.query.error });
		} else {
			return res.render("error", { message: "File not Found!" });
		}
	} catch (e) {
		console.log(e);
		return res.render("error", { message: "File not Found!" });
	}
};

controller.publishPost = async (req, res) => {
	let publishDate = new Date(req.body.publishDay + " " + req.body.publishTime);
	let now = new Date();
	if ((now - publishDate) / 1000 > 60) {
		return res.redirect(
			url.format({
				pathname: "/users/editor/review/publish",
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
			pathname: "/",
			query: {
				publishMessage: "Xuất bản bài viết thành công",
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
	return res.render("denied-post-editor");
};

controller.viewApprovedPost = async (req, res) => {
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

	return res.render("approved-post-editor");
};

controller.showDraft = async (req, res) => {
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

	return res.render("drafted-post-editor");
};

controller.removeDraft = async (req, res) => {
	try {
		await models.Post.destroy({
			where: {
				id: req.body.draftId,
			},
		});

		return res.redirect(
			url.format({
				pathname: "/users/profile",
				query: {
					successMessage: `Xóa bài nháp ${req.body.draftId} thành công!`,
				},
			})
		);
	} catch (e) {
		return res.redirect(
			url.format({
				pathname: "/users/profile",
				query: {
					failedMessage: "Xóa bài nháp thất bại, đã có lỗi ở dữ liệu!",
				},
			})
		);
	}
};

controller.showApprovedPostWriter = async (req, res) => {
	const post = await models.Post.findOne({
		where: {
			id: req.query.id,
			authorId: req.user.dataValues.id,
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

	return res.render("approved-post-writer");
}
module.exports = controller;
