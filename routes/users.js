var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.headers['user-agent']);
  res.json({users: [{name: 'Timmy'}]});
});

module.exports = router;
