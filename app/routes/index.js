'use strict';
module.exports = function (app, passport) {
  app.get('/', function (req, res) {
    res.render('index.ejs', {
      title: app.get('nomApp'),
      errors: []
    });
  });
};
  
