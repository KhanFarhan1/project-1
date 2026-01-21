if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// console.log(process.env.CLOUD_NAME);
// console.log(process.env.API_KEY);
// console.log(process.env.API_SECRET);

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const dbs_url = process.env.ATLAS_URL;
//const Mong_URL = "mongodb://127.0.0.1:27017/Project_1";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./route/listing.js");
const reviewRouter = require("./route/review.js");
const userRouter = require("./route/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./model/user.js");
//const { error } = require("console");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

//session

const store = MongoStore.create({
  mongoUrl: dbs_url,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => {
  console.log("Error in Mongo session store:", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOption));
app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(user.createStrategy()); // ← FIX THIS
// passport.serializeUser(user.serializeUser());
// passport.deserializeUser(user.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//
main()
  .then(() => {
    console.log("Database is working");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbs_url);
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
// app.get("/demouser", async (req, res) => {
//   let fakeuser = new user({
//     email: "khanrabiya@gmail.com",
//     username: "hello123",
//   });
//   let registerUser = await user.register(fakeuser, "123djf");
//   res.send(registerUser);
// });

app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});
app.use((err, req, res, next) => {
  let { statuscode = 500, message = "SomeThing Went Wrong!!" } = err;
  res.status(statuscode).render("listings/error.ejs", { err });
  //res.status(statuscode).render(message);
});
app.listen(port, () => {
  console.log(`App is Listening on port ${port}`);
});
