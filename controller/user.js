const user = require("../model/user.js");

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new user({
      email,
      username,
    });
    const registeredUser = await user.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome ${username} `);
      res.redirect("/listing");
    });
    console.log(registeredUser);
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};
module.exports.render_loginpage = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "You logged in Successfully!!");
  let redirecturl = res.locals.saveUrl || "/listing";
  res.redirect(redirecturl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You logout Successfully");
    res.redirect("/listing");
  });
};
