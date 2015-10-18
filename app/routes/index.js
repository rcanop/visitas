/* global nomApp */
'use strict';
module.exports = function (app, passport) {
  app.get("/", function (req, res) {
    if (!req.isAuthenticated()) {
      // página de index cuando no login.
      res.render('index.ejs', {
        layout: 'layout',
        title: app.get('nomApp'),
        user: null,
        errors: []
      });
    } else {
      // página de index cuando no login.
      res.redirect('/about.html');
    }
  });

  // Formulario de acceso.
  app.get('/login', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', {
      message: req.flash('loginMessage'),
      title: app.get('nomApp') + ' - Acceder',
      user: req.user,
      errors: []
    });
  });
  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
    
  // -----------------------------
  // Alta de usuario
  // -----------------------------
    
  // Formulario de alta.
  app.get('/signup', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', {
      message: req.flash('signupMessage'),
      title: app.get('nomApp') + ' - Registrar',
      errors: []
    });
  });
    
  // process the signup form
  app.post('/signup',
    passport.authenticate('local-signup',
      {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
      })
    );
      

  app.get('/profile', isLoggedIn, function (req, res) {
    console.log(app.get('nomApp'));
    // render the page and pass in any flash data if it exists
    res.render('profile.ejs', {
      title: app.get('nomApp') + ' - Detalle Usuario',
      errors: [],
      user: req.user
    });

  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });


    
};

function isLoggedIn(req, res, next) {
        
    // Si el usario está autenticado pasamos a la siguiente evaluación 
    if (req.isAuthenticated())
        return next();
        
    // sino a la página principal.
    res.redirect('/');
}