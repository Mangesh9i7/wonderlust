const User = require("../models/user.js");



module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (error) => {
            if (error) {
                req.flash("error", "Login failed after signup.");
                return res.redirect("/signup");
            }
            req.flash("success", "Welcome to Wonderlust!");
            res.redirect("/listing");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
        console.log(error);
    }
};


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to Wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            next(error);
        }
        req.flash("success", "You have logged out.");
        res.redirect("/login");
    });
};