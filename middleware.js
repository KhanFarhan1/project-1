const listening = require("./model/listening");
const review = require("./model/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isloggedin = (req, res, next) => {
  // console.log(req);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    // console.log(req.originalUrl);
    req.flash("error", "Please log in to create a listing");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveredirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.saveUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await listening.findById(id);
  if (!req.user || !listing.owner._id.equals(req.user._id)) {
    req.flash("error", "🚫 Access Denied");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.validatelistening = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.isreviewAuthor = async (req, res, next) => {
  let { id, review_id } = req.params;
  let reveiw = await review.findById(review_id);
  if (!req.user || !reveiw.author._id.equals(req.user._id)) {
    req.flash("error", "🚫 Access Denied");
    return res.redirect(`/listing/${id}`);
  }
  next();
};
