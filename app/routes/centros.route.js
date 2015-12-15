'use strict';

var centros = require('../controllers/centros.controller.js');
/* GET users listing. */
module.exports = function (app, passport) {

  app.route('/api/centros/:id')
    .get(centros.read)
    .post(centros.update)
    .put(centros.update);

  app.route('/api/centros')
    .get(centros.list);

};
