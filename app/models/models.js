/* global process, initDB */
'use strict';
// módulos que necesitamos
var configDB = require('../config/database.js');
var sql = require('sqlite3').verbose();
var db = new sql.Database(configDB.DATABASE_STORAGE);
var initDB = false;
if (!initDB) {
  init();
}

function init() {
  initDB = true;
  process.nextTick(function () {
    db.exec('PRAGMA foreign_keys = \'1\';');
  });
  process.nextTick(function () {
    createTableUsuarios(configDB.DROP_TABLES);
    createTableCentros(configDB.DROP_TABLES);
    createTablePersonal(configDB.DROP_TABLES);
    createTableVisitas(configDB.DROP_TABLES);
    createTableVisitasPersona(configDB.DROP_TABLES);
  });
}
module.exports = db;

function createTableUsuarios(dropTable) {
  var tablaExiste = true;
  process.nextTick(function () {
    if (dropTable) {
      db.exec('DROP TABLE IF EXISTS usuarios');
      tablaExiste = false;

    }
  });

  process.nextTick(function () {
    var cmdSQL = 'CREATE TABLE IF NOT EXISTS usuarios ( ' +
      'idusuarios INTEGER PRIMARY KEY AUTOINCREMENT,\r\n' +
      'tipousuario SMALLINT NOT NULL, \r\n ' +
      'email VARCHAR(254),\r\n' +
      'password VARCHAR(8192), \r\n' +
      'fb_id VARCHAR(128), \r\n' +
      'fb_token VARCHAR(4096), \r\n' +
      'fb_email VARCHAR(254),\r\n' +
      'fb_name VARCHAR(254), \r\n' +
      'fb_firstname VARCHAR(254) \r\n,' +
      'fb_lastname VARCHAR(254)\r\n' +
      ')';
    db.exec(cmdSQL);
    
  });
}


function createTableCentros(dropTable) {
  var tablaExiste = true;
  process.nextTick(function () {
    if (dropTable) {
      db.exec('DROP TABLE IF EXISTS centros');
      tablaExiste = false;

    }
  });

  process.nextTick(function () {
    var cmdSQL = 'CREATE TABLE IF NOT EXISTS centros ( ' +
      'idcentros INTEGER PRIMARY KEY,\r\n' +
      'centro VARCHAR(100) NOT NULL, \r\n' +
      'direccion VARCHAR(1000),\r\n' +
      'codpos VARCHAR(10),\r\n' +
      'poblacion VARCHAR(100), \r\n' +
      'provincia VARCHAR(100), \r\n' +
      'email VARCHAR(254),\r\n' +
      'telef VARCHAR(15),\r\n' +
      'movil VARCHAR(15),\r\n' +
      'idusuarios INTEGER NOT NULL \r\n' +
      ')';
    db.exec(cmdSQL);

    cmdSQL = 'INSERT INTO centros (centro, codpos, poblacion, idusuarios) VALUES (\'Mi centro de prueba\', \'29400\', \'Ronda\', 1)';
    db.exec(cmdSQL);
    cmdSQL = 'INSERT INTO centros (centro, codpos, poblacion, idusuarios) VALUES (\'Comedor Escolar\', \'29400\', \'Ronda\', 1)';
    db.exec(cmdSQL);

  });

  process.nextTick(function () {
    if (!tablaExiste) {
      var cmdSQL = 'CREATE INDEX centros_idusu ON centros (idusuarios)';
      db.exec(cmdSQL);
    }
  });
}

function createTablePersonal(dropTable) {
  var tablaExiste = true;
  process.nextTick(function () {
    if (dropTable) {
      db.exec('DROP TABLE IF EXISTS personal');
      tablaExiste = false;

    }
  });

  process.nextTick(function () {
    var cmdSQL = 'CREATE TABLE IF NOT EXISTS personal ( ' +
      'idpersonal INTEGER PRIMARY KEY AUTOINCREMENT,\r\n' +
      'nombre VARCHAR(254) NOT NULL, \r\n' +
      'apellidos VARCHAR(254) NULL, \r\n' +
      'nif VARCHAR(200) NULL, \r\n' + 
      'tipopersonal SMALLINT NOT NULL, \r\n ' +
      'email VARCHAR(254),\r\n' +
      'telef VARCHAR(15), \r\n' +
      'movil VARCHAR(128), \r\n' +
      'puesto VARCHAR(254), \r\n' +
      'categoria VARCHAR(254),\r\n' +
      'situacion VARCHAR(254),\r\n' +
      'idusuarios INTEGER NOT NULL\r\n' + 
      ')';
    db.exec(cmdSQL);

  });
  process.nextTick(function () {
    if (!tablaExiste) {
      var cmdSQL = 'CREATE INDEX personal_idusu ON personal (idusuarios)';
      db.exec(cmdSQL);
    }
  });
}
function createTableVisitas(dropTable) {
  var tablaExiste = true;
  process.nextTick(function () {
    if (dropTable) {
      db.exec('DROP TABLE IF EXISTS visitas');
      tablaExiste = false;

    }
  });

  process.nextTick(function () {
    var cmdSQL = 'CREATE TABLE IF NOT EXISTS visitas ( ' +
      'idvisitas INTEGER PRIMARY KEY AUTOINCREMENT,\r\n' +
      'idusuarios INTEGER NOT NULL,\r\n' +
      'idcentros INTEGER NOT NULL,\r\n' +
      'asunto VARCHAR(254) NOT NULL,\r\n' +
      'objetivo TEXT NULL,\r\n' +
      'fecha VARCHAR(10) NOT NULL\r\n' +
      ')';

    db.exec(cmdSQL);

  });

  process.nextTick(function () {
    if (!tablaExiste) {
      var cmdSQL = 'CREATE INDEX visitas_idusu ON visitas (idusuarios)';
      db.exec(cmdSQL);
      cmdSQL = 'CREATE INDEX visitas_idcentro ON visitas (idcentros)';
      db.exec(cmdSQL);
    }
  });

}
function createTableVisitasPersona(dropTable) {
  var tablaExiste = true;
  process.nextTick(function () {
    if (dropTable) {
      db.exec('DROP TABLE IF EXISTS visitaspersona');
      tablaExiste = false;

    }
  });

  process.nextTick(function () {
    var cmdSQL = 'CREATE TABLE IF NOT EXISTS visitaspersona ( \r\n ' +
      'idvisitas INTEGER NOT NULL,\r\n' +
      'idpersona INTEGER NOT NULL,\r\n' +
      'asunto VARCHAR(254), \r\n' +
      'objetivo TEXT \r\n' +
      ')';
    db.exec(cmdSQL);

  });

  process.nextTick(function () {
    if (!tablaExiste) {
      var cmdSQL = 'CREATE INDEX visitaspersona_idusu ON visitaspersona (idvisitas)';
      db.exec(cmdSQL);
    }
  });
  
}
