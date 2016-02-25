var Empleados = require('../models/empleados.model.js');
exports.read = function (req, res, next) {
  var empleado = undefined;
  if (isNaN(req.params.id)) {
    res.redirect('app.html');
  } else if (req.params.id <= 0) {
    Empleados.datosBlank();
    Empleados.idusuarios = req.user.idusuarios;
    res.json(Empleados.datosValor());

  } else {
    Empleados.getDatoById(req.params.id, function () {
      empleado = Empleados.datosValor();
      res.json(empleado);
    });

  }
};
exports.list = function (req, res, next) {
  Empleados.getDatosByUsuarioId(req.user.idusuarios, function (empleados) {
    res.json(empleados);
  });
};

exports.update = function (req, res, next) {
  var id = req.params.id;
  Empleados.datosActualizar(req.body.empleado);
  if (id > 0) {
    Empleados.modeloUpdate(function (empleado) {
      res.json(empleado);
    });
  } else {
    Empleados.modeloCreate(function (empleado) {
      res.json(empleado);
    });
  }
};