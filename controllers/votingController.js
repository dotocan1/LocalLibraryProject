const BookInstance = require("../models/complaint.js");
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");

exports.complaint_post = [
  // Validate and sanitize the name field.
  body("name", "Complaint name must contain at least 3 characters")
    .trim()
    .isLength({ min: 30 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a complaint object with escaped and trimmed data.
    const complaint = new Complaint({
      description: req.body.description,
      user: req.body.user,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("voting", {
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      await complaint.save();
      // New complaint saved. Redirect to voting  page.
      res.redirect('/voting');
    }
  }),
];