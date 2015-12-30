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

  getCentroById: function (id, callback) {
    var cmdSQL = 'SELECT * FROM centros WHERE idcentros = ? LIMIT 1';
    var param = [];
    if (!id || isNaN(id)) {
      id = -1;
    }

    param.push(id);
    var cmd = this.db.prepare(cmdSQL, param);

    cmd.get(function (err, row) {
      if (err) {
        throw err;
      } else {
        if (row) {
          centros.actualizarValores(row);
          callback('', centros.centroValue());
        } else {
          return callback(id, null);
        }
      }
    });

  },

  getCentrosByUsuarioId: function (idUsuarios, cb) {
    var cmdSQL = 'SELECT * FROM centros WHERE idusuarios = ?';
    var rows = [];
    this.db.each(cmdSQL, [idUsuarios], function (err, row) {
      rows.push(row);
    }, function (err, dato) {
      if (rows.length > 0) {
        cb(rows);
      }
    });
  },

  getCentros: function (options, cb) {
    var cmdSQL = 'SELECT COUNT(*) FROM centros '
    var where = '';
    var param = [];
    var rows = [];

    if (!options) {
      options = {};
    }

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        where = (where.length > 0 ? where + ' AND ' : '') +
        prop + ' ' + options[prop].operator + ' ?'
        param.push(options[prop].value)
      }
    }

    if (where.length > 0) {
      cmdSQL += 'WHERE ' + where;

    }

    cmdSQL += ' LIMIT 200';
    this.db.get(cmdSQL, param, function (err, data) {
      var result = {
        exists: false,
        error: err
      };
      if (err) {
        result.error = err;

      } else {
        result.exists = (data.cta > 0);

      }
      cb(result);

    });
  },

  existCentroBy: function (options, cb) {
    var cmdSQL = 'SELECT COUNT(*) cta FROM centros '
    var where = '';
    var param = [];

    if (!options) {
      options = {};
    }

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        where = (where.length > 0 ? where + ' AND ' : '') +
        prop + ' ' + options[prop].operator + ' ?'
        param.push(options[prop].value)
      }
    }

    if (where.length > 0) {
      cmdSQL += 'WHERE ' + where;

    }
    this.db.get(cmdSQL, param, function (err, data) {
      var result = {
        exists: false,
        error: err
      };
      if (err) {
        result.error = err;

      } else {
        result.exists = (data.cta > 0);

      }
      cb(result);

    });

  },
  createCentro: function (cb) {
    var options = {
      centro: {
        name: 'centro',
        value: this.centro,
        operator: '='
      }
    };
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
      centros.existCentroBy(options, function (result) {
        if (!result.exists && !result.error) {
          centros.db.run(cmdSQL, param, function (err) {
            if (err) {
              err.msg = { "error": err };
              cb(err);
            }
            else {
              centros.idcentros = centros.lastID;
              var ct = centros.centroValue();
              cb(ct);
            }
          });
        } else {
          var ct = centros.centroValue();
          ct.msg = { "error": "Ya existe un centro con el nombre: " + centros.centro };
          cb(ct);
        }
      });
    } else {
      // No cumple con las condiciones de inserción
      cb(false);
    }
  },

  updateCentro: function (cb) {
    var options = {
      centro: {
        name: 'centro',
        value: this.centro,
        operator: "="
      },
      idcentros: {
        name: 'idcentros',
        value: this.idcentros,
        operator: "!="
      }
    };
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
      centros.existCentroBy(options, function (result) {
        if (!result.exists && !result.error) {
          centros.db.run(cmdSQL, param, function (err) {
            if (err) {
              console.warn(err.message);
              cb(false);
            } else {
              var ct = centros.centroValue();
              ct.msg = { info: 'Ficha grabada.' };
              cb(ct);
            }
          });
        } else {
          // no cumple los parámetros para añadir el dato.
          var ct = centros.centroValue();
          ct.msg = { error: 'El nombre del centro está repetido.' };
          cb(ct);
        }
      });
    }
  }
}

module.exports = centros;

