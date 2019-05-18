var express = require('express');
var router = express.Router();
var db = require('../database');

// -- Get deploy configurations
router.get('/', function(req, res, next) {
  db.client.get(db.databases.config_db.name, db.databases.config_db.view, {})
    .then(({data, headers, status}) => {
      res.json(data);
    },  err => { console.error(err); });
});


// -- Make a new deploy configuration
router.post('/', function(req, res, next) {
  var deploy = {
    name: req.body['name'],
    // -- local_path is the path to the cloned repo in the API container volume (see docker-compose.yml)
    local_path: req.body['local_path'],
    image_name: req.body['image_name']
  };
  db.client.insert(db_name, deploy)
    .then(({data, headers, status}) => {
      res.json(data);
    }, err => { console.error(err); })
})

// TODO: kick off a new build (build.js?)

module.exports = router;
