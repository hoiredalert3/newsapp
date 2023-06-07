"use strict";
require('dotenv').config()

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
const session  = require('express-session')
const passport = require('./controllers/passport')
const flash = require('connect-flash')

const redisStore = require('connect-redis').default
const {createClient} = require('redis')
const redisClient = createClient({
  url: process.env.REDIS_URL
})
redisClient.connect().catch(console.error)


// Helpers
const { upload, getTempLink } = require("./controllers/dropboxHelper")
const {convertToVietnameseDateTime} = require("./controllers/helpers")

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
      convertToVietnameseDateTime
    }
  })
);
app.set("view engine", EXT);

// Cau hinh su dung session
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new redisStore({client: redisClient}),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 20 * 60 * 1000
  }
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Cau hinh su dudng connect-flash
app.use(flash())

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
