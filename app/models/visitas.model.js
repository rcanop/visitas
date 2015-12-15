'use strict';

var visitas = {
  idvisitas: 0,
  idusuarios: 0,
  idcentros: 0,
  asunto: String, // O normal
  objetivo: String,
  fecha: String,
  db: require('./models.js'),
  Centro: require('./centros.model.js'),

  visitaBlank: function () {

    this.idvisitas = 0;
    this.idusuarios = 0;
    this.idcentros = 0;
    this.asunto = ""; // O normal
    this.objetivo = null;
    this.fecha = null;
    this.centro = {}
  },

  actualizarValores: function (usrObj) {
    for (var p in usrObj) {
      this[p] = usrObj[p];
    }
  },

  getVisitaById: function (options, callback) {
    var cmdSQL = "SELECT * FROM visitas WHERE ";
    var where = "";
    var param = [];
    if (!options || !options.idcentros) {
      options = { idcentros: -1 };
    }

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        where = where.length > 0 ? " AND " : ""
          + prop + " = ?";
        param.push(options[prop]);

      }
    }

    cmdSQL += where + " LIMIT 1";
    var cmd = this.db.prepare(cmdSQL, param);

    cmd.get(function (err, row) {
      if (err) {
        throw err;
      } else {
        if (row) {
          this.actualizarValores(row);
          this.centro = this.Centro.getCentroById(this.idcentros);
          callback("", this);
        } else {
          return callback(options, null);
        }
      }
    });

  },

  getVisitasByUsuarioId: function (usuarioId, callback) {
    var cmdSQL = "SELECT * FROM visitas WHERE idUsuarios = ?";
    var cmd = this.db.prepare(cmdSQL, [usuarioId]);

    cmd.get(function (err, rows) {
      if (err) {
        throw err;
      } else {
        if (rows) {
          this.actualizarValores(rows);
          for (var row in rows) {
            row.centro = this.Centro.getCentroById(row.idcentros);
          }
          callback(this);
        } else {
          return callback(null);
        }
      }
    });
  },

  getVisitas: function (options, callback) {
    var cmdSQL = "SELECT * FROM visitas WHERE "
    var where = "";
    var param = [];
    if (!options || !options.idcentros) {
      options = {};
    }

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        where = where.length > 0 ? " AND " : ""
          + prop + " = ?";
        param.push(options[prop]);

      }
    }

    if (where.length > 0) {
      cmdSQL += where;

    }

    cmdSQL += " LIMIT 200";

    var cmd = this.db.prepare(cmdSQL, param);

    cmd.get(function (err, rows) {
      if (err) {
        throw err;
      } else {
        if (rows) {
          for (var row in rows) {
            row.centro = this.Centro.getCentroById(row.idcentros);
          }
          callback(rows);
        }
        else {
          callback(null);

        }
      }
    });
  },

  createVisitas: function (cb) {
    var cmdSQL = "INSERT INTO visitas (idvisitas, idusuarios, idcentros, asunto, objetivo, fecha)" +
      " VALUES (?, ?, ?, ?, ?, ?)";

    var param = [
      null,
      this.idusuarios,
      this.idcentros,
      this.asunto,
      this.objetivo,
      this.fecha
    ];

    if (this.idusuarios && this.idusuarios > 0) {
      this.db.run(cmdSQL, param, function (err) {
        if (err) {
          cb(err);
        }
        else {
          this.idvisitas = this.lastID;
          cb(false);
        }
      });
    } else {
      // No cumple con las condiciones de inserción
      cb(false);
    }
  },

  updateVisitas: function (cb) {
    var cmdSQL = "UPDATE visitas " +
      "SET idusuarios = ?" +
      ", idcentros = ?" +
      ", objetivo = ?" +
      ", asunto = ?" +
      ", fecha = ?" +
      "WHERE idvisitas = ?";

    var param = [
      this.idusuarios,
      this.idcentros,
      this.asunto,
      this.objetivo,
      this.fecha,
      this.idvisitas
    ];

    if (this.idusuarios && this.idcentros && this.idusuarios > 0 && this.idcentros > 0) {
      this.db.run(cmdSQL, param, function (err) {
        if (err) {
          cb(err);
        } else {
          console.log(this.db.run)
          cb(false);
        }
      });
    } else {
      // no cumple los parámetros para añadir el dato.
      cb(false);
    }
  }
}


module.exports = visitas;
