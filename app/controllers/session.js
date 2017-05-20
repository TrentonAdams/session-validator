/**
 * We're only simulating sessions here, so this is just a hack to get the job
 * done.  We're sharing the session among all clients.
 */

var express = require('express'),
  router = express.Router(),
  sessionManager = require('../session_manager').SessionManager;

module.exports = function (app)
{
  app.use('/', router);
};

router.get('/check-session', function (req, res, next)
{
  let expire = req.query.expire;

  // bad practise changing state with a GET request, this is only a test.
  if (expire === 'true')
  {
    sessionManager.expireSession();
  }

  res.send(sessionManager.session);
});

router.post('/refresh-session', function (req, res, next)
{
  let time = req.body.time;
  console.log(time);
  if (sessionManager.session.sessionValid)
  { // Only manipulate if the current session is valid.
    // if no "time" parameter submitted, set to 600 seconds.
    sessionManager.session.sessionTime = time?time:600;
  }
  res.send(sessionManager.session);
});

