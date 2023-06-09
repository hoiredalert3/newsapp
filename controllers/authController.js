"use strict";

const controller = {};
const passport = require("./passport");
const models = require("../models");

controller.showLogin = (req, res) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("signin", {
    loginMessage: req.flash("loginMessage"),
    reqUrl: req.query.reqUrl
  });
};

controller.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`/users/login?reqUrl=${req.originalUrl}`);
};

controller.login = (req, res, next) => {
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/";
  // console.log(keepSignedIn);
  // console.log(reqUrl);
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
      if (req.body.keepSignedIn) {
        console.log("Remember me");
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
      } else {
        console.log("Dont remember me!");
        req.session.cookie.expires = false; // Cookie expires at end of session
      }
      // console.log(req.session.cookie.maxAge);
      // console.log(reqUrl)
      return res.redirect(reqUrl);
    });
  })(req, res, next);
};

controller.showSignup = (req, res) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("signup", {
    reqUrl: req.query.reqUrl,
    registerMessage: req.flash("registerMessage"),
    registerMessageSuccess: req.flash("registerMessageSuccess")
  });
};

controller.signup = (req, res, next) => {
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/users/profile";
  passport.authenticate("local-register", (error, user) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.redirect(`/users/register?reqUrl=${reqUrl}`);
    }
    req.logIn(user, (error) => {
      if (error) return next(error);
      res.redirect(reqUrl);
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
