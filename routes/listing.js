const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const controller = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


// Index route
router.get("/", wrapAsync(controller.index));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(controller.renderEditForm));



router
    .route("/new")
    .get(isLoggedIn, controller.renderNewForm)
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(controller.createListing)
    );

router
    .route("/:id")
    .get(wrapAsync(controller.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(controller.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(controller.deleteListing)
    );

module.exports = router;