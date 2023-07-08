"use strict";

const controller = {};
const passport = require("./passport");
const models = require("../models");
const url = require("url");

controller.showLogin = (req, res) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("signin", {
    layout: false,
    loginMessage: req.flash("loginMessage"),
    reqUrl: req.query.reqUrl,
    sitekey: process.env.CAPTCHA_SITE_KEY
  });
};

controller.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`/users/login?reqUrl=${req.originalUrl}`);
};
controller.checkLoggedIn = (req, res) => {
  if (req.isAuthenticated()) {
    return true;
  }
  res.redirect(`/users/login?reqUrl=${req.originalUrl}`);
}
// controller.isPremium = async (req, res, next) => {
//   if (req.isAuthenticated()) {
//     //Id = 4, user is admin
//     if (req.user.dataValues.typeId === 1) {
//       const premium = await models.PremiumDetails.findOne({
//         where: {userId: req.user.dataValues.id, status: true};
//       })
//       if(premium){
//         return next();
//       }
//     }
//     else{

//     }
//   }
//   res
//   .status(403)
//   .render("error", { message: "Bạn cần mua Premium để thực hiện thao tác này" });
// }

controller.isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    //Id = 4, user is admin
    if (req.user.dataValues.typeId === 4) {
      return next();
    }
  }

  console.log("In isAdmin");

  res
    .status(403)
    .render("error", { message: "You must be an admin to access admin page!" });
};

controller.login = async (req, res, next) => {
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/";
  // console.log(keepSignedIn);
  // console.log(reqUrl);

  const captchaData = {
    secret: process.env.CAPTCHA_SECRET_KEY,
    response: req.body['g-recaptcha-response']
  }
  const captchaVerification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(Object.entries(captchaData)).toString()
  }).then(_res => _res.json());
  if (captchaVerification.success != true) {
    return res.render("signin", {
      layout: false,
      loginMessage: 'Invalid captcha!',
      reqUrl: reqUrl,
      sitekey: process.env.CAPTCHA_SITE_KEY
    });
  }


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
    registerMessageSuccess: req.flash("registerMessageSuccess"),
    sitekey: process.env.CAPTCHA_SITE_KEY
  });
};

controller.signup = async (req, res, next) => {
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/users/profile";

  const captchaData = {
    secret: process.env.CAPTCHA_SECRET_KEY,
    response: req.body['g-recaptcha-response']
  }
  const captchaVerification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(Object.entries(captchaData)).toString()
  }).then(_res => _res.json());
  if (captchaVerification.success != true) {
    return res.render("signup", {
      registerMessage: 'Invalid captcha!',
      reqUrl: reqUrl,
      sitekey: process.env.CAPTCHA_SITE_KEY
    });
  }

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
};

controller.logout = (req, res) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

controller.forgotPassword1 = async (req, res) => {
  let account = req.body.account;
  let email = null,
    username = null;
  let user;
  if (validateEmail(account)) {
    email = account.toLowerCase();
    user = await models.User.findOne({ where: { email } });
  } else {
    username = account;
    user = await models.User.findOne({
      attributes: ["email"],
      where: { username },
    });
    if (user) email = user.dataValues.email;
  }

  if (user) {
    // Requirement
    const { sign } = require("../services/jwt");
    const { generateOTP } = require("../services/otp");
    const bcrypt = require("bcrypt");

    const otp = generateOTP();
    const signedOTP = sign(otp);
    const encryptedOTP = bcrypt.hashSync(otp, bcrypt.genSaltSync(8));
    const otpLink = `/users/otp?email=${email}`;
    // Gui mail
    const { sendForgotPasswordMail } = require("../services/mailjet");
    sendForgotPasswordMail(user, otp)
      .then(async (result) => {
        console.log("email has been sent");
        try {
          let OTP = await models.OTP.create({
            userId: user.dataValues.id,
            email,
            signedOTP,
            encryptedOTP,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } catch (error) {
          return res.render("forgot-password-0", {
            message:
              "Có lỗi đã xảy ra trong quá trình tạo dữ liệu, chúng tôi rất tiếc về tình huống này...",
          });
        }
        return res.redirect(otpLink);
      })
      .catch((error) => {
        console.log(error.statusCode);
        return res.render("forgot-password-0", {
          message:
            "Có lỗi đã xảy ra trong quá trình gửi email, chúng tôi rất tiếc về tình huống này...",
        });
      });
  } else {
    if (email) {
      return res.render("forgot-password-0", {
        message: "Email của bạn không tồn tại!",
      });
    } else {
      return res.render("forgot-password-0", {
        message: "Username của bạn không tồn tại!",
      });
    }
  }
};

controller.showOTPVerify = async (req, res) => {
  let email = req.query.email;

  try {
    let OTP = await models.OTP.findOne({
      attributes: ["email", "signedOTP", "createdAt"],
      where: { email },
      order: [["createdAt", "DESC"]],
    });
    if (!OTP) {
      return res.render("forgot-password-0", {
        message:
          "Liên kết này đã hết hạn hoặc không tồn tại! \nHãy thử lại lần khác",
      });
    }
    console.log(OTP);
    const hiddenEmail = email.replace(
      email.substring(0, Math.min(email.indexOf("@"), 5)),
      "***"
    );

    let signedOTP = OTP.dataValues.signedOTP;
    let { verify } = require("../services/jwt");
    if (!signedOTP || !verify(signedOTP)) {
      return res.render("forgot-password-0", {
        message:
          "Liên kết này đã hết hạn hoặc không tồn tại! \nHãy thử lại lần khác",
      });
    } else {
      if (req.query.message) {
        return res.render("forgot-password-1", {
          message: req.query.message,
          email
        });
      } else {
        return res.render("forgot-password-1", {
          sendEmail: `Chúng tôi đã gửi một mã gồm 6 chữ cái đến ${hiddenEmail} của bạn.`,
          email,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.render("forgot-password-0", {
      message:
        "Liên kết này đã hết hạn hoặc không tồn tại! \nHãy thử lại lần khác",
    });
  }
};

controller.OTPVerify = async (req, res) => {
  let otp =
    req.body.otp1 +
    req.body.otp2 +
    req.body.otp3 +
    req.body.otp4 +
    req.body.otp5 +
    req.body.otp6;
  let email = req.body.email;
  try {
    console.log(email);
    let OTP = await models.OTP.findOne({
      attributes: ["email", "signedOTP", "encryptedOTP", "createdAt"],
      where: { email },
      order: [["createdAt", "DESC"]],
    });
    console.log(OTP)
    if (!OTP) {
      console.log(0)
      return res.redirect(
        url.format({
          pathname: "/users/forgot",
          query: {
            message: "Liên kết này đã hết hạn hoặc không tồn tại! \nHãy thử lại lần khác",
          },
        })
      );
    }
    const bcrypt = require("bcrypt");
    let { verify } = require("../services/jwt");

    let signedOTP = OTP.dataValues.signedOTP;
    let encryptedOTP = OTP.dataValues.encryptedOTP;
    if (!signedOTP || !verify(signedOTP)) {
      console.log(1);
      return res.redirect(
        url.format({
          pathname: "/users/forgot",
          query: {
            message: "Liên kết này đã hết hạn hoặc không tồn tại! \nHãy thử lại lần khác",
          },
        })
      );
    } else {
      if (!bcrypt.compareSync(otp, encryptedOTP)) {
        console.log(2);
        return res.redirect(
          url.format({
            pathname: "/users/otp",
            query: {
              email,
              message: "Mã OTP của bạn không đúng!",
            },
          })
        );
      } else {
        console.log(3);
        const link = `/users/reset/?email=${email}`;
        return res.redirect(link);
      }
    }
  } catch (error) {
    console.log(error);
    return res.render("forgot-password-0", {
      message:
        "Liên kết này đã hết hạn hoặc không tồn tại! \nHãy thử lại lần khác",
    });
  }
};

controller.showResetPassword = async (req, res) => {
  const email = req.query.email;
  try {
    let OTP = await models.OTP.findOne({
      attributes: ["email", "signedOTP", "encryptedOTP"],
      where: { email },
      order: [["createdAt", "DESC"]],
    });
    const signedOTP = OTP.dataValues.signedOTP;
    let { verify } = require("../services/jwt");
    if (!signedOTP || !verify(signedOTP)) {
      return res.render("forgot-password-0", {
        message:
          "Liên kết này đã hết hạn hoặc không tồn tại!\n Hãy thử lại lần khác",
      });
    } else {
      return res.render("forgot-password-2", { email });
    }
  } catch (error) {
    console.log(error);
    return res.render("forgot-password-0", {
      message:
        "Liên kết này đã hết hạn hoặc không tồn tại! \nHãy thử lại lần khác",
    });
  }
};

controller.resetPassword = async (req, res) => {
  let email = req.body.email;
  let bcrypt = require("bcrypt");
  let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
  await models.OTP.destroy({ where: { email } });
  await models.User.update({ password }, { where: { email } });

  res.render("forgot-password-2", {
    message: "Bạn đã đổi mật khẩu thành công, vui lòng đăng nhập.",
  });
};

module.exports = controller;
