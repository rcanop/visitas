'use strict';

var empleados = require('../controllers/empleados.controller.js');
/* GET users listing. */
module.exports = function (app, passport) {

  app.route('/api/empleados/:id')
    .get(empleados.read)
    .post(empleados.update)
    .put(empleados.update);

  app.route('/api/empleados')
    .get(empleados.list);

};
