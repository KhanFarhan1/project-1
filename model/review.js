// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const reviewSchema = new Schema({
//   Comment: {
//     type: String,
//   },
//   Rating: {
//     type: Number,
//     min: 1,
//     max: 5,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//   },
// });
// module.exports = mongoose.model("Review", reviewSchema);
const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {
    // lowercase c
    type: String,
    required: [true, "Comment is required"],
  },
  rating: {
    // lowercase r
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Minimum 1 star"],
    max: [5, "Maximum 5 stars"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
