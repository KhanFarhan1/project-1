const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync");

const { validatereview, isloggedin, isreviewAuthor } = require("../middleware");
const reviewController = require("../controller/review");
router.post(
  "/",
  isloggedin,
  validatereview,
  wrapAsync(reviewController.addingreview)
);

router.delete(
  "/:review_id",
  isloggedin,
  isreviewAuthor,
  wrapAsync(reviewController.destroy_review)
);

module.exports = router;
