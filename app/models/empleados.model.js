'use strict';

var modelo = {
  idempleados: 0,
  nombre: String,
  apellidos: String,
  nif: String,
  tipo: String,
  grupo: String,
  categoria: String,
  puesto: String,
  telef: String,
  movil: String,
  email: String,
  situacion: String,
  idusuarios: 0,
  _accion: '',
  db: require('./models.js'),

  datosBlank: function () {
    this.idempleados = 0;
    this.nombre = '';
    this.apellidos = null;
    this.nif = null;
    this.tipo = 'LABORAL';
    this.grupo = null;
    this.categoria = null;
    this.puesto = null;
    this.telef = null;
    this.movil = null;
    this.situacion = null;
    this.idusuarios = null;
  },

  datosValor: function () {
    return {
      idempleados: this.idempleados,
      nombre: this.nombre,
      apellidos: this.apellidos,
      nif: this.nif,
      tipo: this.tipo,
      grupo: this.grupo,
      categoria: this.categoria,
      puesto: this.puesto,
      telef: this.telef,
      movil: this.movil,
      email: this.email,
      situacion: this.situacion,
      idusuarios: this.idusuarios,
    };
  },

  datosActualizar: function (usrObj) {
    for (var p in usrObj) {
      this[p] = usrObj[p];
    }
  },

  getDatoById: function (id, callback) {
    var cmdSQL = 'SELECT * FROM empleados WHERE idempleados = ? LIMIT 1';
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
    var cmdSQL = 'SELECT * FROM empleados WHERE idusuarios = ?';
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
    var cmdSQL = 'SELECT COUNT(*) FROM empleados '
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
    var cmdSQL = 'SELECT COUNT(*) cta FROM empleados '
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
    modelo.db.get(cmdSQL, param, function (err, data) {
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
      },
      apellidos: {
        name: 'apellidos',
        value: this.apellidos,
        operator: '='
      },
    };
    var cmdSQL = 'INSERT INTO empleados (idempleados, nombre, apellidos, nif, tipo, grupo, email, telef, movil, puesto, categoria, situacion, idusuarios)' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    var param = [
      null,
      this.nombre,
      this.apellidos,
      this.nif,
      this.tipo,
      this.grupo,
      this.email,
      this.telef,
      this.movil,
      this.puesto,
      this.categoria,
      this.situacion,
      this.idusuarios,
    ];

    this._accion = 'INSERT';

    if (this.idusuarios && this.idusuarios > 0) {
      this.existDatoBy(options, function (result) {
        if (!result.exists && !result.error) {
          modelo.db.run(cmdSQL, param, function (err) {
            if (err) {
              err.msg = { error: err };
              cb(err);
            }
            else {
              modelo.idempleados = modelo.lastID;
              var ct = modelo.datosValor();
              cb(ct);
            }
          });
        } else {
          var ct = modelo.datosValor();
          ct.msg = {
            error: 'Ya existe un empleado con el nombre: ' + modelo.nombre.trim() + ' ' + modelo.apellidos.trim()
          };
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
        operator: '='
      },
      apellidos: {
        name: 'apellidos',
        value: this.apellidos,
        operator: '='
      },
      idempleados: {
        name: 'idempleados',
        value: this.idempleados,
        operator: '!='
      }
    };

    var cmdSQL = 'UPDATE OR FAIL empleados ' +
      'SET nombre = ?' +
      ', apellidos = ?' +
      ', nif = ?' +
      ', tipo = ?' +
      ', grupo = ?' +
      ', email = ?' +
      ', telef = ?' +
      ', movil = ?' +
      ', puesto = ?' +
      ', categoria = ?' +
      ', situacion = ?' +
      ', idusuarios = ? ' +
      'WHERE idempleados = ?';

    var param = [
      this.nombre,
      this.apellidos,
      this.nif,
      this.tipo,
      this.grupo,
      this.email,
      this.telef,
      this.movil,
      this.puesto,
      this.categoria,
      this.situacion,
      this.idusuarios,
      this.idempleados
    ];

    this._accion = 'UPDATE';

    if (this.idusuarios && this.idusuarios > 0 && this.idempleados && this.idempleados > 0
      && this.nombre && this.nombre.length > 0 && this.apellidos && this.apellidos.length > 0) {
      // Buscamos por nombre apellido que no se repita.
      // ----------------------------------------------
      this.existDatoBy(options, function (result) {
        if (!result.exists && !result.error) {
          // Buscamos por nif que no se repita si éste está lleno.
          // -----------------------------------------------------
          if (modelo.nif && modelo.nif.trim().length > 0) {
            var options = {
              nif: {
                name: 'nif',
                value: modelo.nif,
                operator: '='
              },
              idempleados: {
                name: 'idempleados',
                value: modelo.idempleados,
                operator: '!='
              }
            };
            modelo.existDatoBy(options, function (result) {
              if (!result.exists && !result.error) {
                // Hacer actualización.
                // --------------------
                modelo.run(cmdSQL, param, cb);

              } else {
                // no cumple los parámetros para añadir el dato.
                // ---------------------------------------------
                var ct = modelo.datosValor();
                ct.msg = {
                  error: 'Ya existe un empleado con el nif: ' + modelo.nif
                };
                cb(ct);
              }

            });

          } else {
            // Hacer actualización, ya que el nif no está relleno.
            // ---------------------------------------------------
            modelo.run(cmdSQL, param, cb);
          }
        } else {
          // no cumple los parámetros para añadir el dato.
          // ---------------------------------------------
          var ct = modelo.datosValor();
          ct.msg = {
            error: 'Ya existe un empleado con el nombre: ' + modelo.nombre.trim() + ' ' + modelo.apellidos.trim()
          };
          cb(ct);
        }
      });
    }
  },

  modeloDelete: function (options, cb) {
    var cmdSQL = 'DELETE FROM empleados '
    var where = '';
    var param = [];

    if (!options) {
      options = {
        idempleados: {
          name: 'idempleados',
          value: this.idempleados,
          operator: '='
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

    this._accion = 'DELETE';
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

