var express = require('express');
var router = express.Router();
var docker = require('../docker');

router.get('/', function(req, res, next) {
  docker.container.list()
   // Inspect
  .then(containers => {
    //res.json({ containers: containers.map((c) => { return c.name; }) })
    console.log(containers);
    res.json(
      containers.map((c) => {
        return {
          image: c.data.Image,
          command: c.data.Command,
          created: c.data.Created,
          ports: c.data.Ports,
          state: c.data.State,
          status: c.data.Status,
          id: c.data.Id,
          names: c.data.Names
        };
      })
    );
  })
  .catch(error => console.log(error));
});

module.exports = router;

/*

manage deployed containers on frank
manage deployed containers elsewhere

*/
