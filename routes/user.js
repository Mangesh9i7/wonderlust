const express = require("express");
const passport = require("passport");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js")


const controller = require("../controllers/users.js");


router
    .route("/signup")
    .get(controller.renderSignupForm)
    .post(wrapAsync(controller.signup)
    );

router
    .route("/login")
    .get(controller.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        controller.login
    );


// Logout handler
router.get("/logout", controller.logout);

module.exports = router;