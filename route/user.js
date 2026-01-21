const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router
  .route("/signup")
  .get((req, res) => {
    res.render("user/signup.ejs");
  })
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.render_loginpage)
  .post(
    saveredirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);
module.exports = router;
