/*global process */
'use strict';
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

module.exports = function (passport) {
  // Serialización.
  passport.serializeUser(function (user, done) {
    done(null, user.idUsuarios);
  });

  passport.deserializeUser(function (id, done) {
    //var user = User;
    User.getUserById(id, function (err, User) {
      done(err, User);
    });
  });

  // =========================================================================
  // Estrategia de autenticación local, alta y acceso
  // =========================================================================
    
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  }, function (req, email, password, done) {
    // asynchronous
    process.nextTick(function () {
      // Buscar el email del usuario, si NO existe crear el usuario y darlo como logado. 
      User.getUserByEmail(email, function (user) {
        // Si hubiese un parámetro de error se mandaria como parámetro a la función y se llamaría a done(err)
        // if (err) {
        //   // Error en el modelo.
        //   return done(err);
        // }
          
        // Si el usuario ya existe se devielve el error y no se crea.
        if (user) {
          return done(null, false, req.flash('signupMessage', 'El correo electrónico está en uso.'));

        } else {
          // Crear el usuario NUEVO
          User.usuarioBlank();
                    
          // Creamos las credenciales
          User.email = email;
          User.password = User.generateHash(password);
          User.tipoUsuario = 0;
                    
          // Grabamos el usuario en el modelo
          User.createUser(function (err) {
            if (err) {
              return done(err);

            } else {
              return done(null, User);

            }
          });
        }
      });
    });
  }));

  

passport.use('local-login', new LocalStrategy({
  // por defecto, local strategy usa usuario y  password, para este método usaremos como usuario el correo electrónico.
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // allows us to pass back the entire request to the callback
}, function (req, email, password, done) {

  process.nextTick(function () {  
        
    // Se busca usuario si este existe se comprueba su password y si ok pues de devuelve el usuario, 
    // sino se manda el mensaje de error correspondiente.
    User.getUserByEmail(email, function (user) {
      // Si hubiese un parámetro de error se mandaria como parámetro a la función y se llamaría a done(err)
      // if (err) {
      //   // Error en llamada.
      //   return done(err);
      // }
          
      if (!user) {
        // KO por usuario erróneo, mensaje de error
        return done(null, false, req.flash('loginMessage', 'Usuario no encontrado.')); // req.flash is the way to set flashdata using connect-flash
      }

      if (!user.validPassword(password)) {
        // KO por password errónea, mensaje de error
        return done(null, false, req.flash('loginMessage', '¡Uuups! clave errónea.')); // create the loginMessage and save it to session as flashdata
      }

      // respuesta OK con el usuario autenticado.
      return done(null, user);

    });
  });
}));

};
