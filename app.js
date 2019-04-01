const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const localStrategy = require("passport-local");
const flash = require("connect-flash");


// Importing files
var Campground = require("./models/campground.js"); // ./ - references the current directory
var Comment = require("./models/comment.js");
var User = require("./models/user.js");
var seedDB = require("./seeds.js");


var authRoutes = require("./routes/index.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes = require("./routes/comments.js");


mongoose.connect("mongodb://localhost/yelp_camp_v12", { useNewUrlParser: true }); // connected to yelp_camp_v12 database
app.use(bodyParser.urlencoded({extended: true})); // handles HTTP POST request
app.use(express.static(__dirname + "/public")); // __dirname - directory where script was run
app.use(methodOverride("_method")); // method-override listens for _method
app.use(flash()); // enables use of simple flash messages
// seedDB();


// Passport config
app.use(require("express-session")({
    secret: "Top secret page", // secret - used to encode and decode sessions
    resave: false,
    saveUninitialized: false
}));


// always needed when using passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

// reading the data from the session, then encoding and decoding the sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.currentUser = req.user; // res.locals.currentUser - enables currentUser variable to be used on all templates and routes, req.user - contains logged-in users username and password
    res.locals.success = req.flash("success"); // passing the key "success" which will display its respective value
    res.locals.error = req.flash("error");
    next(); // compulary as it will enable to move to next middleware/route handler
});


// Refactoring
app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes); // adds /campgrounds as a prefix to every route in campgrounds.js
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){ // process.env.PORT, process.env.IP  - environmental viriables set up for cloud9 which we access
    console.log("Server started");
});



