const express = require("express");
const router = express.Router({mergeParams: true}); // merge params from campgrounds and comments together to enable accessing findById


// Importing files
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware/index.js");


// NEW comment route
router.get("/new", middleware.isLoggedIn, (req, res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new.ejs", {campground: campground});
        }
    });
});


// CREATE comment route
router.post("/", middleware.isLoggedIn, (req, res) => {
    // lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }
                else {
                    // add id and username to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


// EDIT comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect("back");
        }
        else {
            res.render("comments/edit.ejs", {campground_id: req.params.id, comment: foundComment});
        }
    });
});


// UPDATE comment route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    // find and update correct comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => { // req.params.comment_id - 1st parameter is the defined comment id, req.body.comment - 2nd parameter is new data
        if(err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id); // redirects to the right show page with specified id
        }
    });
});


// DESTROY comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
   // deletes a comment
   Comment.findByIdAndRemove(req.params.comment_id, (err) => {
       if(err) {
           res.redirect("back");
       }
       else {
           req.flash("success", "Successfully deleted comment");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});


module.exports = router;


