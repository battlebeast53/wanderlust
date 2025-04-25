const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Listing = require("../models/listing");
const router = express.Router({ mergeParams: true });
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware");
const { createReview, destroyReview } = require("../controllers/review");

//Post Review Route
router.post("/", validateReview,isLoggedIn, wrapAsync(createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(destroyReview));

module.exports = router;