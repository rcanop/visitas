'use stricts';
module.exports = function (app) {
    // app.get('/', function (req, res) {
    //     res.render('index.ejs', {
    //         errors: []
    //     });
    // });
    app.get("/", function (req, res) {
        
        // if (!req.isAuthenticated()) {
            // página de index cuando no login.
        res.render('index.ejs'
            // {
            //     layout: 'layout',
            //     title: 'Visitas',
            //     user: null,
            //     errors: []
            // }
            )
        // } else {
        //     // página de index cuando no login.
        //     res.redirect('/visitas');
        // }
    });
};

