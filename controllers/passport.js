"use strict";

const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const models = require("../models");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Called by passport.session to get the user's data from DB (based on req.user)
passport.deserializeUser(async (id, done) => {
  try {
    let user = await models.User.findOne({
      attributes: [
        "id",
        "username",
        "name",
        "email",
        "dob",
        "pseudonym",
        "managementCategory",
        "password",
        "typeId",
      ],
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "account", // ten dang nhap la email / username
      passwordField: "password",
      passReqToCallback: true, // truyen req vao callback de kiem tra user da dang nhap
    },
    async (req, account, password, done) => {
      // console.log(account);
      // console.log(password);
      let isEmail = false;
      if (validateEmail(account)) {
        account = account.toLowerCase();
        isEmail = true;
      }
      try {
        // console.log(req.user)
        if (!req.user) {
          // neu user chua dang nhap
          let user;
          if (isEmail) {
            user = await models.User.findOne({
              where: { email: account },
            });
            // console.log(user)
            if (!user) {
              // Neu email khong ton tai
              return done(
                null,
                false,
                req.flash("loginMessage", "Địa chỉ email không tồn tại!")
              );
            }
          } else {
            user = await models.User.findOne({
              where: { username: account },
            });
            // console.log(user)
            if (!user) {
              // Neu username khong ton tai
              return done(
                null,
                false,
                req.flash("loginMessage", "Username không tồn tại!")
              );
            }
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Mật khẩu sai!")
            );
          }
          return done(null, user);
        }
        // bo qua dang nhap
        done(null, req.user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
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

// Dang ki tai khoan
passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      if (req.user) {
        return done(null, req.user);
      }
      try {
        let user_by_username = await models.User.findOne({
          where: { username },
        });
        let user_by_email = await models.User.findOne({
          where: { email: req.body.email },
        });

        if (user_by_username) {
          return done(
            null,
            false,
            req.flash("registerMessage", "Tên người dùng đã bị sử dụng")
          );
        }

        if (user_by_email) {
          return done(
            null,
            false,
            req.flash("registerMessage", "Email đã bị sử dụng")
          );
        }

        if(age(new Date(req.body.dob)) < 13){
          return done(
            null,
            false,
            req.flash("registerMessage", "Người dùng phải trên 13 tuổi!")
          );
        }

        let user = await models.User.create({
          username,
          email: req.body.email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
          name: req.body.name,
          dob: req.body.dob,
          typeId: 1,
          pseudonym: null,
          managementCategory: null,
        });

        console.log(user)
        // Thong bao dang ki thanh cong
        done(
          null,
          false,
          req.flash(
            "registerMessageSuccess",
            "Bạn đã đăng ký thành công, hãy đăng nhập."
          )
        );
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
