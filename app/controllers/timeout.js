/**
 * We're only simulating sessions here, so this is just a hack to get the job
 * done.  We're sharing the session among all clients.
 */

var express = require('express'),
  router = express.Router();

module.exports = function (app)
{
  app.use('/', router);
};

router.get('/timeout', function (req, res, next)
{
  res.render('timeout', {title: "Session Timed Out"});
});

