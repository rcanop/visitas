/* global nomApp */
'use strict';
module.exports = function (app, passport) {
  // Página ppal de entrada al aplicativo.
  app.get("/", function (req, res, next) {
    if (!req.isAuthenticated()) {
      // página de index cuando no login.
      res.render('index.ejs', {
        layout: 'layout',
        title: app.get('nomApp'),
        user: null,
        message: req.flash('loginMessage'),
        errors: []
      });
    } else {
      // página de index cuando login.
      res.redirect("/profile");
      
    }
  });

  app.get("/acerca.html", function (req, res, next) {
    if (req.isAuthenticated()) {
      next()

    } else {
      res.redirect("/");
    }
  });

  app.get("/app.html", function (req, res, next) {
    if (req.isAuthenticated()) {
      next()

    } else {
      res.redirect("/");
    }
  });
  
  // ------------------------------------------------------------------------------------
  // Login y Alta local
  // ------------------------------------------------------------------------------------
  app.get('/login', function (req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage'),
      title: app.get('nomApp') + ' - Acceder',
      user: req.user,
      errors: []
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
    
  // Alta de usuario local
  app.get('/signup', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', {
      message: req.flash('signupMessage'),
      title: app.get('nomApp') + ' - Registrar',
      errors: []
    });
  });
    
  app.post('/signup',
    passport.authenticate('local-signup',
      {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
      })
    );
      
  // ------------------------------------------------------------------------------------
  // Rutas de Facebook
  // ------------------------------------------------------------------------------------
  app.get('/auth/facebook', passport.authenticate('facebook'));
  
    
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/',
      scope: ['email', 'name'] // esto es muy importante.
    }));


  app.get('/profile', isLoggedIn, function (req, res) {
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