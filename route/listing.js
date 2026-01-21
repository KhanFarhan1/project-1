const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const { isloggedin, isOwner, validatelistening } = require("../middleware");
const listingcontroller = require("../controller/listing");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
router.route("/").get(wrapAsync(listingcontroller.indexpage)).post(
  isloggedin,
  //validatelistening,
  upload.single("image"),
  wrapAsync(listingcontroller.savenewlisting)
);
router.get(
  "/:id/edit",
  isloggedin,
  isOwner,
  wrapAsync(listingcontroller.editform)
);

router.get("/new", isloggedin, listingcontroller.showNewListingfrom);
router
  .route("/:id")
  .get(wrapAsync(listingcontroller.showspecificdata))
  .put(
    isloggedin,
    isOwner,
    upload.single("image"),
    validatelistening,
    wrapAsync(listingcontroller.save_editform)
  )
  .delete(isOwner, isloggedin, wrapAsync(listingcontroller.destroylisting));

module.exports = router;
