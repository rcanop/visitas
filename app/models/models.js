/* global process */
'use strict';
 // módulos que necesitamos
var configDB = require('../config/database.js');
var sql = require('sqlite3').verbose();
var db = new sql.Database(configDB.DATABASE_STORAGE);

createTableUsuarios(configDB.DROP_TABLES);

module.exports = db;

function createTableUsuarios(dropTable) {
  process.nextTick(function () {
    if (dropTable) {
      db.exec("DROP TABLE IF EXISTS usuarios");

    }
  });

  process.nextTick(function () {
    var cmdSQL = "CREATE TABLE IF NOT EXISTS usuarios ( " +
      "idUsuarios INTEGER PRIMARY KEY AUTOINCREMENT,\r\n" +
      "tipoUsuario SMALLINT NOT NULL, \r\n " +
      "email VARCHAR(254),\r\n" +
      "password VARCHAR(8192), \r\n" +
      "fb_id VARCHAR(128), \r\n" +
      "fb_token VARCHAR(4096), \r\n" +
      "fb_email VARCHAR(254),\r\n" +
      "fb_name VARCHAR(254), \r\n" +
      "fb_firstname VARCHAR(254) \r\n," +
      "fb_lastname VARCHAR(254)\r\n" +
      ")";
    db.exec(cmdSQL);

  });
}

}