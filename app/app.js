/*global __dirname, process */
'use strict';
var express = require('express');
var path = require('path'); // necesario para trabajar con directorios.
var partials = require('express-partials'); // necesario para poder usar vistas parciales.

var logger = require('morgan'); // módulo log para el desarrollo.
    
// Módulos necesarios para hacer el login.
 
// login
var session = require('express-session')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , flash = require('connect-flash');

// Iniciar aplicación
var app = express();

// Nombre de la aplicacion:
app.set('nomApp', 'Visitas');


// Activar el log en desarrollo.
app.use(logger('dev'));

// Antes de la configuración del login debemos tener inicializado esto.
app.use(cookieParser());
app.use(bodyParser.json()); // parser application/json
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(session({
  resave: false,
  secret: 'secretísimo_que_te_cagas_shshsh!!!',
  saveUninitialized: true
}));

// Configuración del login. Necesita tener cargado antes la preconfiguración 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // flash para pasar mensajes a la session.
require('./config/passport.js')(passport);

// Establececer el directorio de las vistas ejs.
app.set('views', path.join(__dirname, 'views')); 

// Instalar ejs
app.set('view engine', 'ejs');

// Activar el uso de vistas parciales.
app.use(partials());


// establecer las rutas.
require('./routes/index')(app, passport);


// Establecer la parte de páginas estáticas. 
app.use(express.static('public'));

// Enrutadores de error

// Pagina 404
app.use(function (req, res, next) {
    var err = new Error('Página no encontrada.');
    err.status = 404;
    next(err);
});

// Errores desde desarrollo.
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title: app.get('nomApp') + ' - Error',
            message: err.message,
            error: err
        });
    });
}

// errores producción
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        title: app.get('nomApp') + ' - Error',
        error: {},
    });
});

module.exports = app; 