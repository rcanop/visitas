var Centro = require('../models/visitas.model.js');
exports.read = function (req, res, next) {
  var centro = req.centro;
  res.json(centro);
};
exports.list = function (req, res, next) {
  res.centros = new Array()
  Centro.getVisitasByUsuarioId(req.user.idusuarios, function (rows) {
    res.json(rows);
  });
};