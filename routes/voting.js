var express = require('express');
var router = express.Router();
const User = require("../models/user");
const YellowCard = require("../models/yellowCard.js")
var votingController = require('../controllers/votingController')

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
        user.remainingTime = new Date(allYellowCards[y].end_time);
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
router.get('/yellowcard', async function (req, res, next) {
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
module.exports = router;