// Importing files
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");


var middleware = {};


// login middleware
middleware.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    // else
    req.flash("error", "You need to be logged in first!"); // req.flash is used before redirecting to another page, 1st parameter - i.e. error is the key, 2nd parameter - is the value 
    res.redirect("/login");
}


// campground middleware
middleware.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()) { // checks if user is logged in
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else {
                // checks if campground exists
                if(!foundCampground) {
                    req.flash("error", "Campground not found");
                    return res.redirect("back");
                }
                
                // checks if user owns the campground
                if(foundCampground.author.id.equals(req.user.id)) { // foundCampground.author.id - mongoose object, req.user.id - string, .equals - mongoose function which compares object and string
                    next(); // the code that comes from route handler i.e. callback function
                }  
                else {
                    req.flash("error", "You don't have the permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in first!");
        res.redirect("back"); // takes user back from where they came
    }
}


// comment middleware
middleware.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()) { // checks if user is logged in
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                res.redirect("back");
            }
            else {
                // checks if user owns the comment
                if(foundComment.author.id.equals(req.user.id)) { // foundComment.author.id - mongoose object, req.user.id - string, .equals - mongoose function which compares object and string
                    next(); // the code that comes from route handler i.e. callback function
                }  
                else {
                    req.flash("error", "You don't have the permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in first!");
        res.redirect("back"); // takes user back from where they came
    }
}


module.exports = middleware;

