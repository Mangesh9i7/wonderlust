const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");

const controller = require("../controllers/reviews.js");

// Reviews Route
// POST Route
router.post("/", isLoggedIn, validateReview, wrapAsync(controller.createReview));

// Pull Operator use
// Delete review route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(controller.deleteReview))


module.exports = router;
