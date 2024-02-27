const BookInstance = require("../models/complaint.js");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Complaint = require("../models/complaint");
const YellowCard = require("../models/yellowCard.js")
const { body, validationResult } = require("express-validator");

// Post a complaint
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

// POST yellow card
exports.yellowcard_post =
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Create a yelow card object with escaped and trimmed data.
    var count = req.body.count;
    console.log(`this is the count ${count}`)
    var yellowcardArray = [];
    for (var i = 0; i < count; i++) {
      const yellowcard = new YellowCard({
        user: req.body.selectedUser,
        start_time: Date.now(),// Calculate the end time by adding 2 hours worth of milliseconds
        end_time: Date.now() + (48 * 60 * 60 * 1000), // 48 hours * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second
      });
      yellowcardArray.push(yellowcard);
    }
    console.log(yellowcardArray)
    // await yellowcard.save();
    yellowcardArray.forEach((item) => {
      console.log(item)
    })
    await Promise.all(yellowcardArray.map(async (item) => {
      try {
        await item.save();
      } catch (error) {
        console.error('Error saving item:', error);
      }
    }));

    // console.log(`hey this is the complaint + ${complaint}`)
    // New complaint saved. Redirect to voting  page.
    res.redirect('/voting');

  });