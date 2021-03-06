var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var hooks = require('./routes/hooks');
var containers = require('./routes/containers');
var deploy = require('./routes/deploy');
var build = require('./routes/build');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/hooks', hooks);
app.use('/api/v1/containers', containers);
app.use('/api/v1/deploy', deploy);
app.use('/api/v1/build', build);

var db = require('./database');

db.client.listDatabases().then( dbs => {
  for(var k in db.databases) {
    var db_name = db.databases[k].name;
    console.log("Looking for " + db_name);
    if(dbs.indexOf(db_name) < 0) {
      console.log('creating database: ' + db_name);
      db.client.createDatabase(db_name)
        .then(() => {}, err => { console.error(err); });
    } else {
      console.log('database found: ' + db_name);
    }
  }
})

module.exports = app;
