const Listing = require("../models/listing.js");
const { listingJoiSchema } = require("../Schema.js");
const Expresserror = require("../utils/Expresserror.js");

module.exports.index = async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs", { alllisting });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing");
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const { error } = listingJoiSchema.validate(req.body);
    if (error) {
        throw new Expresserror(400, error.message);
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();

    req.flash("success", "New Listing created");
    res.redirect("/listing");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing");
    }
    let originalurl = listing.image.url;
    originalImgUrl = originalurl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImgUrl });
};

module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }

    req.flash("success", "Listing updated");
    res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }

    req.flash("success", "Listing deleted");
    res.redirect("/listing");
};