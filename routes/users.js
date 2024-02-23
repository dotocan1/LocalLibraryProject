var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users cool listing. */
router.get('/cool', function(req, res, next) {
  return res.send('You are so cool, I hope the code updates');
});

module.exports = router;
