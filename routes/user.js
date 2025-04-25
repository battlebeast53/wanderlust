const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const { route } = require("./listing");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const { signupForm, userSignup, loginForm, userLogin, userLogout } = require("../controllers/user");


router
    .route("/signup")
    .get(signupForm)
    .post(wrapAsync(userSignup))



// router.get("/signup",signupForm)

// router.post("/signup",wrapAsync(userSignup))


router
    .route("/login")
    .get(loginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{ failureRedirect : "/login", failureFlash : true}),userLogin)


// router.get("/login",loginForm)

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{ failureRedirect : "/login", failureFlash : true}),userLogin)

router.get("/logout",userLogout)

module.exports = router