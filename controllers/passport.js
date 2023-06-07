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
      console.log(account);
      console.log(password);
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

// // Dang ki tai khoan
// passport.use(
//   "local-register",
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//       passReqToCallback: true,
//     },
//     async (req, email, password, done) => {
//       if (email) {
//         email = email.toLowerCase();
//       }
//       if (req.user) {
//         return done(null, req.user);
//       }
//       try {
//         let user = await models.User.findOne({ where: { email } });
//         if (user) {
//           return done(
//             null,
//             false,
//             req.flash("registerMessage", "Email is already used!")
//           );
//         }
//         user = await models.User.create({
//           email: email,
//           password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
//           firstName: req.body.firstName,
//           lastName: req.body.lastName,
//           mobile: req.body.mobile,
//         });

//         // Thong bao dang ki thanh cong
//         done(
//           null,
//           false,
//           req.flash(
//             "registerMessage",
//             "You have registered successfully, please log in."
//           )
//         );
//       } catch (error) {
//         done(error)
//       }
//     }
//   )
// );

module.exports = passport;
