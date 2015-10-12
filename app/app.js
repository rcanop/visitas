var express = require('express');
var path = require('path'); // necesario para trabajar con directorios.
var partials = require('express-partials'); // necesario para poder usar vistas parciales.

var logger = require('morgan'); // módulo log para el desarrollo.
    

// Iniciar aplicación
var app = express();

// Establececer el directorio de las vistas ejs.
app.set('views', path.join(__dirname, 'views')); 

// Instalar ejs
app.set('view engine', 'ejs');

// Activar el uso de vistas parciales.
app.use(partials());

// Establecer la parte de páginas estáticas. 
app.use(express.static('public'));

// Activar el log en desarrollo.
app.use(logger('dev'));

// establecer las rutas.
require('./routes/index')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Página no encontrada.');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
    });
});


module.exports = app; 