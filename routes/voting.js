var express = require('express');
var router = express.Router();
const User = require("../models/user");
var votingController = require('../controllers/votingController')

/* GET home page. */
router.get('/', async function (req, res, next) {
  // Get all users
  const allUsers = await User.find().sort({ name: 1 }).exec();
  res.render('voting', { user_list: allUsers });
});

/* GET yellow card home page. */
router.get('/yellowcard', async function (req, res, next) {
  // Get all users
  const allUsers = await User.find().sort({ name: 1 }).exec();
  res.render('yellowCardForm', { user_list: allUsers });
});

// POST a complaint
router.post("/post/complaint", votingController.complaint_post);

// POST yellow card
router.post("/post/yellowcard", votingController.yellowcard_post);
module.exports = router;