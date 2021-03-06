const express = require("express");
const router = express.Router();
const passport = require("passport");


// Importing files
var User = require("../models/user.js");


// Root route
router.get("/", (req, res) => { // replace function with => arrow function in es6
    res.render("landing.ejs");
});


// Authentication routes

// Sign-up form
router.get("/register", (req, res) => {
    res.render("register.ejs", {page: 'register'});
});


// Handles user sign-up
router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username}); // new User - we only pass username and save it in database
    User.register(newUser, req.body.password, (err, user) => { // re.body.password - password is saved as hash in database
        if(err) {
            console.log(err);
            return res.render("register.ejs", {error: err.message});
        }
        // else
        passport.authenticate("local")(req, res, function() { // passport.authenticate - logs user in,= and takes care of everthing in session
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});


// Login routes

// Login form
router.get("/login", (req, res) => {
    res.render("login.ejs", {page: 'login'});
});


// Login logic
router.post("/login", passport.authenticate("local", { // middleware - code runs after start of route but before callback function
    successRedirect: "campgrounds", // redirects to /campgrounds if username & password are correct
    failureRedirect: "/login" // redcirects to /login if username & password are incorrect
    }), (req,res) => {
    
});


// Logout route
router.get("/logout", (req, res) => {
    req.logout(); // passport destroys all user data in the session
    req.flash("success", " Successfully logged out");
    res.redirect("/campgrounds");
});


module.exports = router;

