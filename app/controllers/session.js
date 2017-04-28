/**
 * We're only simulating sessions here, so this is just a hack to get the job
 * done.  We're sharing the session among all clients.
 */

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  sessionManager = require('../session_manager').SessionManager;

module.exports = function (app)
{
  app.use('/', router);
};

router.get('/check-session', function (req, res, next)
{
  var expire = req.param("expire", false);
  console.log("expire: ", expire);
  // bad practise changing state with a GET request, this is only a test.
  if (expire === 'true')
  {
    sessionManager.expireSession();
  }

  res.send(sessionManager.session);
});

