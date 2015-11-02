'use strict';

var users = require('../controllers/users_controller.js');
/* GET users listing. */
module.exports = function (app, passport) {
    app.route('/users')
    .get(users.list);

    app.route('/users/current')
    .get(users.read);
};