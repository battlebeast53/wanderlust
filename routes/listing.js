const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const { populate } = require("../models/user");
const { index, show, create, createNewForm, edit, update, destroy } = require("../controllers/listing");
const multer  = require('multer')
const { storage } = require("../cloudConfig");
const upload = multer({ storage })

router
    .route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(create));


//new route
router.get("/new", isLoggedIn, createNewForm);



//Show Route
// router.get("/:id", wrapAsync(show));

//Index route
// router.get("/", wrapAsync(index))

//create route
// router.post("/", isLoggedIn, validateListing, wrapAsync(create))

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(edit))

router
    .route("/:id")                                          
    .get(wrapAsync(show))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(update))
    .delete(isLoggedIn, isOwner, wrapAsync(destroy))

//Update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(update))

//Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(destroy))


module.exports = router;