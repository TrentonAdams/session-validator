var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  sessionManager = require('../sessionManager').SessionManager;

module.exports = function (app)
{
  app.use('/', router);
};

router.get('/', function (req, res, next)
{
  Article.find(function (err, articles)
  {
    if (err) return next(err);
    console.log(sessionManager);
    sessionManager.startSession();
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
});
