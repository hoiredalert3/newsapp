'use strict'

// Declare controller
const controller = {}

// Show homepage
controller.showHomePage = (req, res) => {
  res.render('index')
}

controller.showPage = (req, res, next) => {
  const pages = [
    "post-list-category",
    "admin-categories",
    "post-list-tag",
    "profile",
    "admin",
    "admin-categories",
    "admin-posts",
    "admin-tags",
    "admin-users",
    "signin",
    "signup",
    "writer-create",
    "article-review",
    "publish-article",
    "forgot-password"
  ];
  if (pages.includes(req.params.page)) {
    return res.render(req.params.page);
  }
  next();
}

module.exports = controller