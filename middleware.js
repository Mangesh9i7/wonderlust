const Listing = require("./models/listing");
const Expresserror = require("./utils/Expresserror.js");
const { listingJoiSchema, reviewSchema } = require("./Schema.js");
const Review = require("./models/review");


module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Access denied: You're not the owner of this listing.");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingJoiSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new Expresserror(400, errmsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new Expresserror(400, errmsg)
    } else {
        next();
    }
};


module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId); // Correct variable name
    if (!review || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Access denied: You're not the author of this review.");
        return res.redirect(`/listing/${id}`);
    }
    next();
};