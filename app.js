var express = require('express'),
  config = require('./config/config'),
  glob = require('glob');

var app = express();

module.exports = require('./config/express')(app, config);

app.use(express.static('./public'));
app.listen(config.port, function ()
{
  console.log('http://localhost:' + config.port);
});

