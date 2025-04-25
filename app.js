if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
var methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user");
const review = require("./models/review");



const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = process.env.MONGO_URL;

main().then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const store = MongoStore.create({
    mongoUrl : MONGO_URL,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
})

store.on("error",() => {
    console.log("Error in Mongo Session Store");
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}




app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

// app.get("/", (req, res) => {
//     res.send("Hi , this is root");
// });

// app.get("/demouser",async (req,res) => {
//     let fakeUser = new User({
//         email : "student2027@gmail.com",
//         username : "h@arshit1221"
//     })

//     let registeredUser = await User.register(fakeUser,"hello1122");
//     res.send(registeredUser);
// })

//Listings
app.use("/listings",listingRouter);


//Reviews
app.use("/listings/:id/reviews",reviewRouter);

//Users
app.use("/",userRouter);

// app.get("/testListing",async (req,res) => {
//     let sampleListing = new Listing({
//         title : "My new villa",
//         description : "By the beach",
//         price : 6000,
//         location : "Goa",
//         country : "India"
//     });
//     await sampleListing.save();

//     console.log("sample is saved");
//     res.send("Successful testing");
// });

app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page not found!!"));
})

app.use((err, req, res, next) => {
    let {statusCode = 500,message = "Something went wrong!!"} = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log("server is running on port : 8080");
});