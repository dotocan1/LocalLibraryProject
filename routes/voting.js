var express = require('express');
var router = express.Router();
//var votingController = require('../controllers/votingController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('voting');
});

// POST a complaint

// POST yellow card

module.exports = router;
