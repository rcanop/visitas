var Centro = require('../models/centros.model.js');
exports.read = function (req, res, next) {
  var centro = undefined;
  if (isNaN(req.params.id)) {
    res.redirect('app.html');
  } else if (req.params.id <= 0) {
    Centro.datosBlank();
    Centro.idusuarios = req.user.idusuarios;
    res.json(Centro.datosValor());

  } else {
    Centro.getDatoById(req.params.id, function () {
      centro = Centro.datosValor();
      res.json(centro);
    });

  }
};
exports.list = function (req, res, next) {
  Centro.getDatosByUsuarioId(req.user.idusuarios, function (centros) {
    res.json(centros);
  });
};

exports.update = function (req, res, next) {
  var id = req.params.id;
  Centro.datosActualizar(req.body.centro);
  if (id > 0) {
    Centro.modeloUpdate(function (centro) {
      res.json(centro);
    });
  } else {
    Centro.modeloCreate(function (centro) {
      res.json(centro);
    });
  }
};