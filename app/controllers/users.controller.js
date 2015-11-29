var User = require('../models/user.model.js');
exports.read = function (req, res, next) {
    var user = req.user;
    res.json(user);
};
exports.list = function (req, res, next) {
    res.users = new Array()
    User.getUsers(function (rows) {
        res.users = rows;
    });
};