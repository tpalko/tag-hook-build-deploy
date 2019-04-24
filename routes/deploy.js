var express = require('express');
var router = express.Router();
var db = require('../database');

router.get('/', function(req, res, next) {
  db.client.get(db.databases.config_db.name, db.databases.config_db.view, {})
    .then(({data, headers, status}) => {
      res.json(data);
    },  err => { console.error(err); });
});

router.post('/', function(req, res, next) {
  var deploy = {
    name: req.body['name'],
    local_path: req.body['local_path'],
    image_name: req.body['image_name']
  };
  db.client.insert(db_name, deploy)
    .then(({data, headers, status}) => {
      res.json(data);
    }, err => { console.error(err); })
})

module.exports = router;

/*
what do you wanna DO here?

accept and respond to POST from git hook
manage deployed containers on frank
manage deployed containers elsewhere
manage locally hosted libraries


*/
