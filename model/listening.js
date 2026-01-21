const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const Listening_Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: {
      type: String,
    },
    filename: {
      type: String,
      default: "default_listingimage",
    },
  },
  price: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // category: {
  //   type: String,
  //   enum: [
  //     "Home",
  //     "Iconic City",
  //     "Mountain",
  //     "Trending",
  //     "Hotels",
  //     "Restaurants",
  //     "Nature",
  //     "Beach",
  //     "Spa & Wellness",
  //     "Car Rentals",
  //     "Flights",
  //     "Events & Tickets",
  //   ],
  // },
});
Listening_Schema.post("findOneAndDelete", async (listening) => {
  if (listening) {
    await Review.deleteMany({ _id: { $in: listening.reviews } });
  }
});

const listening = mongoose.model("listening", Listening_Schema);
module.exports = listening;
