'use strict';

var visitas = require('../controllers/visitas.controller.js');
/* GET users listing. */
module.exports = function (app, passport) {
  app.route('/model/visitas')
    .get(visitas.list);

  app.route('/model/visitas/:id')
    .get(visitas.read);
};
