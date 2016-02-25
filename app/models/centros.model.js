'use strict';

var modelo = {
  idcentros: 0,
  nombre: String,
  direccion: String,
  codpos: String,
  poblacion: String,
  provincia: String,
  email: String,
  telef: String,
  movil: String,
  idusuarios: 0,
  _accion: '',
  db: require('./models.js'),

  datosBlank: function () {
    this.idcentros = 0;
    this.nombre = '';
    this.direccion = null;
    this.codpos = null;
    this.provincia = null;
    this.poblacion = null;
    this.email = null;
    this.telef = null;
    this.movil = null;
    this.idusuarios = null;
  },

  datosValor: function () {
    return {
      idcentros: this.idcentros,
      nombre: this.nombre,
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

  datosActualizar: function (usrObj) {
    for (var p in usrObj) {
      this[p] = usrObj[p];
    }
  },

  getDatoById: function (id, callback) {
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
          modelo.datosActualizar(row);
          callback('', modelo.datosValor());
        } else {
          return callback(id, null);
        }
      }
    });

  },

  getDatosByUsuarioId: function (idUsuarios, cb) {
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

  getDatos: function (options, cb) {
    var cmdSQL = 'SELECT COUNT(*) FROM centros '
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

  existDatoBy: function (options, cb) {
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
  modeloCreate: function (cb) {
    var options = {
      nombre: {
        name: 'nombre',
        value: this.nombre,
        operator: '='
      }
    };
    var cmdSQL = 'INSERT INTO centros (idcentros, nombre, direccion, codpos, poblacion, provincia, email, telef, movil, idUsuarios)' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    var param = [
      null,
      this.nombre,
      this.direccion,
      this.codpos,
      this.poblacion,
      this.provincia,
      this.email,
      this.telef,
      this.movil,
      this.idusuarios,
    ];

    this._accion = 'INSERT';
    
    if (this.idusuarios && this.idusuarios > 0) {
      this.existDatoBy(options, function (result) {
        if (!result.exists && !result.error) {
          modelo.run(cmdSQL, param, cb);
          
        } else {
          var ct = modelo.datosValor();
          ct.msg = { "error": "Ya existe un centro con el nombre: " + modelo.centro };
          cb(ct);
          
        }
      });
    } else {
      // No cumple con las condiciones de inserción
      cb(false);
    }
  },

  modeloUpdate: function (cb) {
    var options = {
      nombre: {
        name: 'nombre',
        value: this.nombre,
        operator: "="
      },
      idcentros: {
        name: 'idcentros',
        value: this.idcentros,
        operator: "!="
      }
    };
    var cmdSQL = 'UPDATE centros ' +
      'SET nombre = ?' +
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
      this.nombre,
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

    this._accion = 'UPDATE';

    if (this.idusuarios && this.idcentros && this.idusuarios > 0 && this.idcentros > 0
      && this.nombre && this.nombre.length > 0) {
      this.existDatoBy(options, function (result) {
        if (!result.exists && !result.error) {
          modelo.run(cmdSQL, param, cb);
        } else {
          // no cumple los parámetros para añadir el dato.
          var ct = modelo.datosValor();
          ct.msg = { error: 'El nombre del centro está repetido.' };
          cb(ct);
        }
      });
    }
  },

  modeloDelete: function (options, cb) {
    var cmdSQL = 'DELETE FROM centros '
    var where = '';
    var param = [];

    this._accion = 'DELETE';

    if (!options) {
      options = {
        idcentros: {
          name: 'idcentros',
          value: this.idcentros,
          operator: "="
        }
      };
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

    this.run(cmdSQL, param, cb);
  },

  run: function (cmdSQL, param, cb) {
    var stmt = this.db.prepare(cmdSQL, param);
    stmt.run(function (err, data) {
      if (err) {
        console.warn(err.message);
        cb(false);
      } else {
        var ct = modelo.datosValor();

        if ((modelo._accion == 'UPDATE' && this.changes > 0)) {
          ct.msg = { info: 'Ficha grabada.' };
          
        } else if (modelo._accion == 'INSERT' && this.lastID > 0) {
          ct.msg = { info: 'Centro creado.' };
          
        } else if (modelo._accion == 'DELETE' && this.changes > 0) {
          modelo.datosBlank();
          ct = modelo.datosValor();
          ct.msg = { info: modelo.changes + ' Registro(s) eliminado(s)' };
          
        } else if (modelo._accion == 'UPDATE' && this.changes == 0) {
          ct.msg = { warn: 'No se ha actualizado ningún registro.' };
          
        } else if (modelo._accion == 'DELETE' && this.changes == 1) {
          ct.msg = { warn: 'No se ha eliminado ningún registro.' };
          
        }

        cb(ct);
        modelo._accion = '';
        
      }
    });
    stmt.finalize();
  }

}
module.exports = modelo;

