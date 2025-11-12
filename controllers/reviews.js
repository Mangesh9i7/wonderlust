const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let foundListing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    foundListing.reviews.push(newReview);

    await newReview.save();
    await foundListing.save();

    console.log("Review saved");
    console.log(req.body);
    req.flash("success", "New review created");

    res.redirect(`/listing/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listing/${id}`);
};