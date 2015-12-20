'use strict';

var centros = {
  idcentros: 0,
  centro: String,
  direccion: String,
  codpos: String,
  poblacion: String,
  provincia: String,
  email: String,
  telef: String,
  movil: String,
  idusuarios: 0,
  db: require('./models.js'),

  centroBlank: function () {
    this.idcentros = 0;
    this.centro = '';
    this.direccion = null;
    this.codpos = null;
    this.provincia = null;
    this.poblacion = null;
    this.email = null;
    this.telef = null;
    this.movil = null;
    this.idusuarios = null;
  },

  centroValue: function () {
    return {
      idcentros: this.idcentros,
      centro: this.centro,
      direccion: this.direccion,
      codpos: this.codpos,
      provincia: this.provincia,
      poblacion: this.poblacion,
      email: this.email,
      telef: this.telef,
      movil: this.movil,
      idusuarios: this.idusuarios,
    };
  },

  actualizarValores: function (usrObj) {
    for (var p in usrObj) {
      this[p] = usrObj[p];
    }
  },

  getCentroById: function (options, callback) {
    var cmdSQL = 'SELECT * FROM centros WHERE ';
    var where = '';
    var param = [];
    if (!options || !options.idcentros) {
      options = { idcentros: -1 };
    }

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        where = where.length > 0 ? ' AND ' : ''
          + prop + ' = ?';
        param.push(options[prop]);

      }
    }

    cmdSQL += where + ' LIMIT 1';
    var cmd = this.db.prepare(cmdSQL, param);

    cmd.get(function (err, row) {
      if (err) {
        throw err;
      } else {
        if (row) {
          centros.actualizarValores(row);
          callback('', centros.centroValue());
        } else {
          return callback(options, null);
        }
      }
    });

  },

  getCentrosByUsuarioId: function (idUsuarios, callback) {
    var cmdSQL = 'SELECT * FROM centros WHERE idusuarios = ?';
    var rows = [];
    this.db.each(cmdSQL, [idUsuarios], function (err, row) {
      rows.push(row);
    }, function (data) {
      if (rows.length > 0) {
        callback(rows);
      }
    });
  },

  getCentros: function (options, callback) {
    var cmdSQL = 'SELECT * FROM centros '
    var where = '';
    var param = [];
    var rows = [];

    if (!options || !options.idcentros) {
      options = {};
    }

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        where = where.length > 0 ? ' AND ' :
          '' + prop + ' = ?';
        param.push(options[prop]);
      }
    }

    if (where.length > 0) {
      cmdSQL += 'WHERE ' + where;

    }

    cmdSQL += ' LIMIT 200';

    this.db.each(cmdSQL, param, function (err, row) {
      rows.push(row);
    });

    if (rows.length > 0) {
      callback(rows);
    }

  },

  createCentro: function (cb) {
    var cmdSQL = 'INSERT INTO centros (idcentros, centro, direccion, codpos, poblacion, provincia, email, telef, movil, idUsuarios)' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    var param = [
      null,
      this.centro,
      this.direccion,
      this.codpos,
      this.poblacion,
      this.provincia,
      this.email,
      this.telef,
      this.movil,
      this.idusuarios,
    ];

    if (this.idusuarios && this.idusuarios > 0) {
      this.db.run(cmdSQL, param, function (err) {
        if (err) {
          cb(err);
        }
        else {
          centros.idcentros = this.lastID;
          cb(centros.centroValue());
        }
      });
    } else {
      // No cumple con las condiciones de inserción
      cb(false);
    }
  },

  updateCentro: function (cb) {
    var cmdSQL = 'UPDATE centros ' +
      'SET centro = ?' +
      ', direccion = ?' +
      ', codpos = ?' +
      ', poblacion = ?' +
      ', provincia = ?' +
      ', email = ?' +
      ', telef = ?' +
      ', movil = ?' +
      ', idusuarios = ? ' +
      'WHERE idcentros = ?';

    var param = [
      this.centro,
      this.direccion,
      this.codpos,
      this.poblacion,
      this.provincia,
      this.email,
      this.telef,
      this.movil,
      this.idusuarios,
      this.idcentros,
    ];

    if (this.idusuarios && this.idcentros && this.idusuarios > 0 && this.idcentros > 0
      && this.centro && this.centro.length > 0) {
      this.db.run(cmdSQL, param, function (err) {
        if (err) {
          console.warn(err.message);
          cb(false);
        } else {
          cb(centros.centroValue());
        }
      });
    } else {
      // no cumple los parámetros para añadir el dato.
      cb(false);
    }
  }
}



module.exports = centros;

