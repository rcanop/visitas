module.exports = {
    'facebookAuth' : {
        'clientID'          : 'tuAppId', 
        'clientSecret'      : 'tu_app_secret', 
        'callbackURL'       : 'http://localhost:3000/auth/facebook/callback',
        'profileFields'     : ['id', 'emails', 'name'] // esto es muy importante, sino los datos de email y name no salen
    },
}