"use strict";

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
  })
);
app.set("view engine", EXT);

// routes
app.use("/", require("./routes/indexRouter"));
app.use("/posts", require("./routes/postsRouter"));
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
