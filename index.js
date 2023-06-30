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

const minute = 60 * 1000;
setInterval(updatePremium, minute);

async function updatePremium() {
  try {
    const premiums = await models.PremiumDetails.findAll({
      attributes: ["id", "grantedSince", "status"],
      where: {
        status: true,
      },
    });
    premiums.forEach(async (premium) => {
      const grantdSince = new Date(premium.dataValues.grantedSince);
      const currentDate = new Date();
      const expiredDate = new Date(
        grantdSince.getFullYear(),
        grantdSince.getMonth(),
        grantdSince.getDate() + 7
      );

      if (expiredDate <= currentDate)
        await models.PremiumDetails.update(
          { statusId: false },
          { where: { id: premium.dataValues.id } }
        );
    });
  } catch (error) {
    console.log(error);
  }
}

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
    res.locals.categories = categories;
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
          // check if premium
          const premium = await models.PremiumDetails.findAll({
            attributes: ["id", "userId", "grantedSince", "status"],
            where: {
              userId: req.user.dataValues.id,
              status: true,
            },
            order: [["grantedSince", "DESC"]],
            limit: 1,
          });
          if (premium.length > 0) {
            const grantdSince = new Date(premium[0].dataValues.grantedSince);
            const currentDate = new Date();
            const expiredDay = new Date(
              grantdSince.getFullYear(),
              grantdSince.getMonth(),
              grantdSince.getDate() + 7
            );
            // console.log(expiredDay)
            const differenceInMilliseconds = Math.abs(
              currentDate.getTime() - expiredDay.getTime()
            );
            premium[0].rest = Math.floor(
              differenceInMilliseconds / 1000 / 60 / 60 / 24
            );
            res.locals.premium = premium[0];
            console.log(res.locals.premium.dataValues);
          } else res.locals.unpremium = true;
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
