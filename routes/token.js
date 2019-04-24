var express = require('express');
var router = express.Router();

/* GET a token */
router.get('/', function(req, res, next) {
  console.log(req.query);
  console.log(req.headers['user-agent']);
  res.json({token: 'timmytoken'});
});

module.exports = router;
