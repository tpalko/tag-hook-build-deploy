var express = require('express');
var router = express.Router();
var db = require('../database');
var docker = require('../docker');
const tar = require('tar-fs');

const promisifyStream = stream => new Promise((resolve, reject) => {
  stream.on('data', data => console.log(data.toString()))
  stream.on('end', resolve)
  stream.on('error', reject)
});

router.post('/', function(req, res, next) {

  console.log(req.headers['user-agent']);
  //console.log(req);

  db.client.insert(db.databases.hooks_db.name, req.body)
    .then(({data, headers, status}) => {
      console.log("Hook POST written: " + status);

      var app_name = req.body['repository']['name'];

      console.log("Looking up " + app_name);

      db.client.mango(db.databases.config_db.name, { selector: { name: app_name }})
        .then(({data, headers, status}) => {

          if(data.warning) {
            console.error("WARNING! " + data.warning);
          }

          if(data.docs.length == 0) {
            console.error("No documents");
            return;
          }

          var local_path = data.docs[0].local_path;
          var image_name = data.docs[0].image_name;

          if(local_path == undefined || image_name == undefined) {
            console.error("Required parameters not found");
            return;
          }

          console.log("Building " + local_path + " as " + image_name);

          var tarStream = tar.pack(local_path);

          docker.image.build(tarStream, {
              t: image_name
            })
            .then(stream => promisifyStream(stream))
            .then(() => docker.image.get(image_name).status())
            .catch(error => console.log(error));

        }, err => { console.error(err) })

      res.json({});

    }, err => {
      console.error(err);
    });

});

module.exports = router;
