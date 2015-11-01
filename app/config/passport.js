/*global process */
'use strict';
var LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy; // Login con facebook 

var User = require('../models/user.js');

// Login con facebook
var configAuth = require('./auth.js');

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

  // =========================================================================
  // Estrategia de autenticación Facebook
  // =========================================================================
  passport.use('facebook', new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: configAuth.facebookAuth.profileFields

  }, function (token, refreshToken, profile, done) {
    // tema asincronía
    process.nextTick(function () {
      User.getUserByFacebookId(profile.id, function (user) {
        if (user) {
          user.fb_token = token;
          user.fb_firstname = (profile.name.givenName || null);
          user.fb_lastname = (profile.name.familyName || null)
          user.fb_name = (User.fb_firstname || '') + ((' ' + User.fb_lastname) || '');

          if (profile.emails) {
            user.fb_email = profile.emails[0].value || null;
          } else {
            user.fb_mail = null;
          }
          // Actualizamos el usuario con los datos de facebook
          user.updateUser(function (err) {
            if (err) {
              console.log("error de actualización de usuario con datos facebook.");
              return done(null, false);
            } else {
              return done(null, User);
            }
          });
         
        } else {
          if (profile.emails) {
            User.usuarioBlank();
            
            // Busca el correo de facebook en la tabla usuarios, si existe añadir la información sino crear usuario.
            User.getUserByEmail(profile.emails[0].value, function (user) {
              if (user) {
                User.idUsuarios = user.idUsuarios;
                User.email = user.email;
                User.tipoUsuario = user.tipoUsuario;
                User.password = user.password;

              } else {
                User.email = profile.emails[0].value;
                User.tipoUsuario = 1;
              }
              
              // Creamos / actualizamos las credenciales de facebook
              User.fb_token = token;
              User.fb_id = profile.id;
              User.fb_email = profile.emails[0].value;
              User.fb_firstname = (profile.name.givenName || null);
              User.fb_lastname = (profile.name.familyName || null)
              User.fb_name = (User.fb_firstname || '') + ((' ' + User.fb_lastname) || '');
              
              if (!User.email) {
                // sino tenemos un email no seguimos nuestra autenticación se basa principalmente en los email.
                return done(null, false);
              }

              if (User.idUsuarios <= 0 || isNaN(User.idUsuarios)) {
                // Crear el usuario NUEVO
                User.createUser(function (err) {
                  if (err) {
                    console.log("Error creacion usuario tipo facebook");
                    console.log(err);
                    return done(err);

                  } else {
                    return done(null, User);

                  }
                });
              } else {
                // Actualizamos los datos del usuario con los de facebook.
                User.updateUser(function (err) {
                  if (err) {
                    console.log("error de actualización de usuario con datos facebook.");
                    return done(null, false);
                  } else {
                    return done(null, User);
                  }
                })
              } // (User.idUsuarios <= 0 || isNaN(User.idUsuarios))
            });
          } else { 
            // no se ha recuperado el email de facebook. No se registra el usuario.
            return done(null, false)
          } // profile.emails
        } // if(user) 
      }); //User.getByuFacebookId
    });
  }));
};
