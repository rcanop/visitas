#!/usr/bin/env node
/* global process */
'use strict';

/**
 * Module dependencies.
 */
var app = require('./app.js');
var debug = require('debug')('visitas:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

/**
 * Crear el servidor HTTP
 */

var server = http.createServer(app);


/**
 * Establecer el puerto de escucha.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log('Servidor funcionando en localhost:' + port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Eventos  listener de error del servidor HTTP.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' necesita privilegios superiores');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' ya está en uso');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Maneajor de enventos del servidor HTTP.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}
