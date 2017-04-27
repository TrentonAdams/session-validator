var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

module.exports = function (app)
{
  app.use('/', router);
};

/**
 * We're only simulating sessions here.
 *
 * @type {{sessionValid: boolean, sessionTime: number}}
 */
var session = {
  sessionValid: true,
  sessionTime: 600
};

var terminate = false;
var intervalVariable;

var sessionCounter = function ()
{
  //console.log('.');
  if (terminate)
  {
    clearTimeout(intervalVariable);
    intervalVariable = undefined;
    terminate = false;
    session.sessionValid = true;
    session.sessionTime = 600;
    return;
  }

  session.sessionTime--;
  //intervalVariable = setInterval(sessionCounter, 1000);
};

router.get('/check-session', function (req, res, next)
{
  var expire = req.param("expire", false);
  console.log("expire: ", expire);
  // bad practise changing state with a GET request, this is only a test.
  if (expire === 'true')
  {
    session.sessionValid = false;
    session.sessionTime= 0;
    terminate = true;
  }

  res.send(session);
});

router.get('/other', function (req, res, next)
{
  if (intervalVariable === undefined)
  {
    console.log("setting up session timer");
    intervalVariable = setInterval(sessionCounter, 1000);
  }

  if (session.sessionValid)
  {
    res.send(
      'Your session is valid for ' + session.sessionTime + ' seconds more');
  }
  else
  {
    return "Your session is invalid"
  }
});
