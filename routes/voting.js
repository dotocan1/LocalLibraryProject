var express = require('express');
var router = express.Router();
const User = require("../models/user");
const YellowCard = require("../models/yellowCard.js")
var votingController = require('../controllers/votingController');
const yellowCard = require('../models/yellowCard.js');
const passport = require('passport');

/* GET home page. */
router.get('/', async function (req, res, next) {
  // Get all users
  const allUsers = await User.find().sort({ name: 1 }).exec();
  const allYellowCards = await YellowCard.find().exec();

  // connect users and yellow cards
  // Using object literal notation
  // Define an object constructor function
  function UserForTable (name, countOfYellowCards, timeRemaining) {
    this.name = name;
    this.countOfYellowCards = countOfYellowCards;
    this.timeRemaining = timeRemaining;
  }

  var usersForTable = [];
  for (var i = 0; i < allUsers.length; i++) {
    var user = new UserForTable(allUsers[i].name, 0, 0)
    for (var y = 0; y < allYellowCards.length; y++) {
      var temp1 = allUsers[i]._id;
      var temp2 = allYellowCards[y].user;
      if (temp1.toString() === temp2.toString()) {
        user.countOfYellowCards = user.countOfYellowCards + 1;
        console.log(allYellowCards[y].end_time)
        var end_time = allYellowCards[y].end_time;
        var start_time = allYellowCards[y].start_time;
        var remainingTime = (end_time - Date.now()) / (60 * 60 * 1000); // Convert milliseconds to hours
        if (remainingTime == 0 || remainingTime < 0) {
          await yellowCard.findByIdAndDelete(allYellowCards[y]._id);
        }
        else {
          user.timeRemaining = remainingTime.toFixed(0);
        }
      }
    }
    usersForTable.push(user)
  }
  console.log(usersForTable)
  res.render('voting', {
    user_list: allUsers,
    yellowcard_list: allYellowCards,
    usersForTable: usersForTable,
  });
});

/* GET yellow card home page. */
router.get('/yellowcard2766', async function (req, res, next) {
  // Get all users
  const allUsers = await User.find().sort({ name: 1 }).exec();

  res.render('yellowCardForm', {
    user_list: allUsers,

  });
});

// POST a complaint
router.post("/post/complaint", votingController.complaint_post);

// POST yellow card
router.post("/post/yellowcard", votingController.yellowcard_post);

// GET all complaints
router.get('/complaints', votingController.complaint_list)

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true // Optional, requires express-flash or connect-flash
}));


// Registration route
router.post('/register', async (req, res) => {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });

    // Save the user to the database
    const newUser = await user.save();

    // Redirect to login or another page
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

module.exports = router;
