var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  sessionManager = require('../session_manager').SessionManager;

module.exports = function (app)
{
  app.use('/', router);
};

router.get('/', function (req, res, next)
{
  Article.find(function (err, articles)
  {
    let body = {
      title: 'Generator-Express MVC',
      articles: articles
    };
    if (err) return next(err);
    console.log(sessionManager);
    sessionManager.startSession();

    // handle html and json responses, so that unit tests can get a sane
    // response.
    if (req.accepts('json'))
    {
      res.send(body);
    }
    else
    {
      res.render('index', body);
    }
  });
});
