const BookInstance = require("../models/complaint.js");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Complaint = require("../models/complaint");
const { body, validationResult } = require("express-validator");

exports.complaint_post = [
  // Validate and sanitize the name field.
  body("description", "Complaint description must contain at least 30 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a complaint object with escaped and trimmed data.
    const complaint = new Complaint({
      description: req.body.description,
      user: req.body.selectedUser,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const allUsers = await User.find().sort({ name: 1 }).exec();
      res.render("voting", {
        errors: errors.array(),
        user_list: allUsers,
      });
      return;
    } else {
      // Data from form is valid.
      await complaint.save();
      // console.log(`hey this is the complaint + ${complaint}`)
      // New complaint saved. Redirect to voting  page.
      res.redirect('/voting');
    }
  }),
];