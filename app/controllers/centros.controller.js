var Centro = require('../models/centros.model.js');
exports.read = function (req, res, next) {
  var centro = undefined;
  if (isNaN(req.params.id)) {
    res.redirect('app.html');
  } else if (req.params.id < 0) {
    Centro.centroBlank();
    centro.idusuarios = req.user.idusuarios;
    res.json(centro);

  } else {
    Centro.getCentroById({ idcentros: req.params.id }, function () {
      centro = Centro.centroValue();
      res.json(centro);
    });

  }
};
exports.list = function (req, res, next) {
  Centro.getCentrosByUsuarioId(req.user.idusuarios, function (centros) {
    res.json(centros);
  });
};

exports.update = function (req, res, next) {
  var id = req.params.id;
  Centro.actualizarValores(req.body.centro);
  if (id > 0) {
    Centro.updateCentro(function (centro) {
      res.json(centro);
    });
  } else {
    Centro.createCentro(function (centro) {
      res.json(centro);
    });
  }
};