"use strict";

const controller = {};
const passport = require("./passport");
const models = require("../models");

controller.showLogin = (req, res) => {
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("signin", {
    loginMessage: req.flash("loginMessage"),
    reqUrl: req.query.reqUrl,
    registerMessage: req.flash("registerMessage"),
  });
};

controller.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`/users/login?reqUrl=${req.originalUrl}`);
};

controller.login = (req, res, next) => {
  let keepSignedIn = req.body.keepSignedIn;
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/users/profile/";
  console.log(keepSignedIn)
  console.log(reqUrl)
  passport.authenticate("local-login", (error, user) => {
    // console.log(user);
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.redirect(`/users/login?reqUrl=${reqUrl}`);
    }
    req.login(user, (error) => {
      if (error) {
        return next(error);
      }
      req.session.cookie.maxAge = keepSignedIn ? 24 * 60 * 60 * 1000 : null;
      // console.log(reqUrl)
      return res.redirect(reqUrl);
    });
  })(req, res, next);
}


controller.logout = (req, res) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
};

module.exports = controller;
