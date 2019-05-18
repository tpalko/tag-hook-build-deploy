var express = require('express');
var router = express.Router();
var db = require('../database');
var docker = require('../docker');

function dothing() {
  docker.container.create({
    name: 'tahobuild01',
    Image: 'tahobuilder_commandline',
    HostConfig: {
      Binds: [
        "/media/storage/development/github.com/photo-binner:/app"
      ]
    },
    WorkingDir: "/app",
    Cmd: ["/usr/bin/python", "setup.py", "build"]
  })
    .then(container => {
      container.start()
        .then((container) => {
          console.log("Container started: " + container.data.Id);
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}

router.post('/', function(req, res, next) {

  console.log(req.headers['user-agent']);

  docker.container.list({all:true})
    .then(containers => {
      console.log("Found " + containers.length + " containers..");
      var old_build_container;
      for(var c in containers){
        if(containers[c].data.Names[0] == '/tahobuild01'){
          console.log("Found old build container..");
          old_build_container = containers[c];
        }
      }
      if(old_build_container != undefined) {
        console.log("Deleting old build container..")
        old_build_container.delete()
          .then(() => {
            dothing();
          });
      }else {
        dothing();
      }
    });

  res.json({});

});

module.exports = router;
