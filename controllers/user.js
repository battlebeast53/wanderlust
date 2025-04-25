const User = require("../models/user");

module.exports.signupForm = (req,res) => {
    res.render("users/signup");
}


module.exports.userSignup  = async (req,res) => {
    try{
        let { username,email,password } = req.body;
        let newUser = new User({email,username});
        const registedUser = await User.register(newUser,password);
        req.login(registedUser,(err) => {
            if(err){
                return next(err);
            } 
            else{
                req.flash("success","Welcome to Wanderlust!");
                res.redirect("/listings");
            }
        })
        
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}


module.exports.loginForm = (req,res) => {
    res.render("users/login");
}

module.exports.userLogin = async(req,res) => {
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.userLogout = (req,res,next) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}