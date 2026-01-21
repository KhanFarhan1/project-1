const listening = require("../model/listening");
const Review = require("../model/review");

module.exports.addingreview = async (req, res) => {
  let listing = await listening.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  //console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("Review Save!!");
  req.flash("success", "New Review Created Successfully!!");
  res.redirect(`/listing/${listing._id}`);
};
module.exports.destroy_review = async (req, res) => {
  let { id, review_id } = req.params;
  await listening.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
  await Review.findByIdAndDelete(review_id);
  req.flash("success", "Review Deleted Successfully!!");
  res.redirect(`/listing/${id}`);
};
