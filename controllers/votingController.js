const BookInstance = require("../models/complaint.js");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Complaint = require("../models/complaint");
const YellowCard = require("../models/yellowCard.js")
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

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
      Date_issued: Date.now(),
    });

    // send an email

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.eu",
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "dotocan@zohomail.eu",
        pass: "$Arn01423",
      },
    });
    
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Ivan Kros" <dotocan@zohomail.eu>', // sender address
        to: "dominik.otocan1@gmail.com", // list of receivers
        subject: "Nova zalba", // Subject line
        // text: "Nova zalba", // plain text body
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Email Title</title>
            <style>
                /* Reset styles */
                body, html {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                }
                /* Wrapper for email content */
                .email-wrapper {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                /* Styles for heading */
                h1 {
                    color: #333333;
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                /* Styles for paragraph */
                p {
                    color: #666666;
                    margin-bottom: 20px;
                }
                /* Styles for link */
                a {
                    color: #007bff;
                    text-decoration: none;
                }
                /* Styles for button */
                .btn {
                    display: inline-block;
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                }
                /* Media query for responsive design */
                @media only screen and (max-width: 600px) {
                    .email-wrapper {
                        width: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <h1>Nova zalba</h1>
                <p>Zalba: ${complaint.description}</p>
            </div>
        </body>
        </html>
        `, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }
    
    main().catch(console.error);


    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.redirect('/voting');;
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
    var yellowcardArray = [];
    for (var i = 0; i < count; i++) {
      const yellowcard = new YellowCard({
        user: req.body.selectedUser,
        start_time: Date.now(),// Calculate the end time by adding 2 hours worth of milliseconds
        end_time: Date.now() + (48 * 60 * 60 * 1000), // 48 hours * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second
      });
      yellowcardArray.push(yellowcard);
    }
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

  // GET all complaints

  // Display list of all Genre.
exports.complaint_list = asyncHandler(async (req, res, next) => {
  const allComplaints = await Complaint.find().sort({ Date_issued: -1 }).populate("user").exec();
  res.render("complaint_list", {
    title: "Complaints List",
    complaint_list: allComplaints,
  });
});