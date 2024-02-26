var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/voting');
});

/* GET votes page. */
router.get('/voting', function(req, res, next) {
  res.render('voting.pug');
});

module.exports = router;
