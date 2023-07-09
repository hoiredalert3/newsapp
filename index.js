"use strict";
require("dotenv").config();

// Declare some constant variable
const PUBLIC = __dirname + "/public";
const VIEWS = __dirname + "/views";
const LAYOUTS = VIEWS + "/layouts";
const PARTIAL = VIEWS + "/partials";
const EXT = "hbs";
const LAYOUT_DEFAULT = "layout";

// App
const express = require("express");
const app = express();
const port = process.env.PORT || 1234;
const express_handlerbars = require("express-handlebars");
const { createPagination } = require("express-handlebars-paginate");
const session = require("express-session");
const passport = require("./controllers/passport");
const flash = require("connect-flash");
const path = require("path");

// Redis
const redisStore = require("connect-redis").default;
const { createClient } = require("redis");
const redisClient = createClient({
	url: process.env.REDIS_URL,
});
redisClient
	.connect()
	.then(() => {
		// other tasks
	})
	.catch(console.error);

// Helpers
const { upload, getTempLink } = require("./controllers/dropboxHelper");
const { convertToVietnameseDateTime } = require("./controllers/helpers");

// Config public static web folder
app.use(express.static(PUBLIC));

// Config express-handlerbars
app.engine(
	"hbs",
	express_handlerbars.engine({
		layoutsDir: LAYOUTS,
		partialsDir: PARTIAL,
		extname: EXT,
		defaultLayout: LAYOUT_DEFAULT,
		runtimeOptions: {
			allowProtoPropertiesByDefault: true,
		},
		helpers: {
			convertToVietnameseDateTime,
			createPagination,
		},
	})
);
app.set("view engine", EXT);

// Cau hinh su dung doc du lieu
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cau hinh su dung session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		store: new redisStore({ client: redisClient }),
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: 24 * 60 * 1000,
		},
	})
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Cau hinh su dung connect-flash
app.use(flash());

// cau hinh tinymce
app.use(
	"/tinymce",
	express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// middleware
const models = require("./models");
const Op = require("sequelize").Op;
// const { setInterval } = require("timers/promises");

async function updatePremium() {
	try {
		const premiums = await models.PremiumDetails.findAll({
			attributes: ["id", "userId", "grantedSince", "status"],
			where: {
				status: true,
			},
		});
		//console.log(`${premiums.length} users premium.`);
		premiums.forEach(async (premium) => {
			console.log(`UserID: ${premium.dataValues.userId}`);
			const grantdSince = new Date(premium.dataValues.grantedSince);
			const currentDate = new Date();
			const expiredDate = new Date(
				grantdSince.getFullYear(),
				grantdSince.getMonth(),
				grantdSince.getDate() + 7
			);

			if (expiredDate <= currentDate) {
				console.log(`UserID: ${premium.dataValues.userId}: expired.`);
				await models.PremiumDetails.update(
					{ statusId: false },
					{ where: { id: premium.dataValues.id } }
				);
			} else {
				console.log(`UserID: ${premium.dataValues.userId}: due.`);
			}
		});
	} catch (error) {
		console.log(error);
	}
}

async function publishPost() {
	try {
		//console.log("Check if is there any post to publish...");
		const approvedPosts = await models.ApprovedPost.findAll({
			attributes: ["id", "postId", "publishAt"],
			where: {
				isPublished: false
			}
		});
		approvedPosts.forEach(async (post) => {
			if (new Date(post.dataValues.publishAt) < new Date()) {
				console.log(
					`Publish post ${post.dataValues.postId} with publish time: ${post.dataValues.publishAt}`
				);
				await models.Post.update(
					{
						statusId: 5,
						publishedAt: new Date(post.dataValues.publishAt),
					},
					{
						where: {
							id: post.dataValues.postId,
						},
					}
				);
				await models.ApprovedPost.update(
					{
						isPublished: true
					},
					{
						where: {
							postId: post.dataValues.postId,
						},
					}
				)

				// Create Post statistic
				await models.PostStatistic.create({
					postId: post.dataValues.postId,
					views: 0,
					lastUpdatedHot: new Date(),
					hot: 0,
				});
			}
		});
	} catch (e) {
		console.log(e);
	}
}
async function updatePostStatistic() {
	const date = new Date()
	if (date.getDay() == 1) { // Monday
		models.PostStatistic.update({
			lastUpdatedHot: new Date(),
			hot: 0
		}, { where: { id:{ [Op.not]: null } } });
	}
}

const minute = 60 * 1000;
// setInterval(updatePremium, minute);
setInterval(publishPost, 5000); // 5s
setInterval(updatePostStatistic, minute * 5); // 5m

app.use(async (req, res, next) => {
	// Load categories cho header
	try {
		const categories = await models.Category.findAll({
			// Cap 1
			attributes: ["id", "title", "parentId"],
			where: { parentId: null },
		});
		categories.forEach(async (parent) => {
			const parentId = parent.dataValues.id;
			let children = await models.Category.findAll({
				// Cap 2
				attributes: ["id", "title", "parentId"],
				where: { parentId },
			});
			// console.log(children.length);
			const arrChildren = [];
			while (children.length)
				arrChildren.push({
					children: children.splice(0, Math.min(3, children.length)),
				});
			parent.arrChildren = arrChildren;
			// console.log(arrChildren);
		});
		res.locals.categoriesHeader = categories;
	} catch (error) {
		console.log(`Error: ${error}`);
	}

	// Authenticate user
	res.locals.isLoggedIn = req.isAuthenticated();
	// console.log(req.user);
	if (res.locals.isLoggedIn == true) {
		res.locals.user = req.user;
		// Get user type
		const typeId = req.user.dataValues.typeId;
		//console.log(`Typeid: ${typeId}`)
		switch (typeId) {
			case 1:
				try {
					const premium = await models.PremiumDetails.findOne({where: {userId: req.user.id}});
					if(premium && new Date(premium.dataValues.validUntil) >= new Date()){
						res.locals.premium = true;
					}
					else {
						res.locals.unpremium = true;
					}
				} catch (error) {
					console.log(error);
				}
				break;
			case 2:
				res.locals.writer = true;
				break;
			case 3:
				res.locals.editor = true;
				break;
			case 4:
				res.locals.admin = true;
				break;
			default:
				res.locals.unpremium = true;
				break;
		}
	}
	next();
});

// Routes
app.use("/", require("./routes/indexRouter"));
app.use("/posts", require("./routes/postsRouter"));
app.use("/users", require("./routes/authRouter"));
app.use("/users", require("./routes/usersRouter"));
app.use("/admin", require("./routes/adminRouter"));

app.use((req, res, next) => {
	res.status(404).render("error", { message: "File not Found!" });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).render("error", { message: "Internal Servel Error" });
});

// Initialize server
app.listen(port, () => {
	console.log(`Server is running on ${port}`);
});
