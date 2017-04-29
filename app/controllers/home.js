var express = require('express'),
  router = express.Router(),
  sessionManager = require('../session_manager').SessionManager;

module.exports = function (app)
{
  app.use('/', router);
};

router.get('/', function (req, res, next)
{
  let body = {
    title: 'Generator-Express MVC'
  };
  console.log(sessionManager);
  sessionManager.startSession();

  // handle html and json responses, so that unit tests can get a sane
  // response.
  if (req.accepts('html'))
  {
    res.render('index', body);
  }
  else
  {
    res.send(body);
  }
});
