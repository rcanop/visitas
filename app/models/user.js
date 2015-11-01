'use strict';

var user = {
    idUsuarios: 0,
    tipoUsuario: 0, // O normal
    email: String,
    password: String,
    fb_id: String,
    fb_email: String,
    fb_token: String,
    fb_name: String,
    fb_firstname: String,
    fb_lastname: String,
    db: require('./models.js'),
    bcrypt: require('bcrypt-nodejs'),
    
    usuarioBlank: function () {
        
        this.idUsuarios = 0;
        this.tipoUsuario = 0; // O normal
        this.email = "";
        this.password = null;
        this.fb_id = null;
        this.fb_email = null;
        this.fb_token = null;
        this.fb_name = null;
        this.fb_firstname = null;
        this.fb_lastname = null;
    },
    
    actualizarValores: function (usrObj) {
      for (var p in usrObj) {
        this[p] = usrObj[p];
      }
    },
    
    getUserById: function (userId, callback) {
        var cmdSQL = "SELECT * FROM usuarios WHERE idUsuarios = ?";
        var cmd = this.db.prepare(cmdSQL, [userId]);
        
        cmd.get(function (err, row) {
          if (err) {
            throw err;
          } else {
            if (row) {
              user.actualizarValores(row);
              callback("", user);
            } else {
              return callback(userId, null);
            }
          }
        });
        
    },
    
    getUserByFacebookId: function (facebookId, callback) {
        var cmdSQL = "SELECT * FROM usuarios WHERE fb_id = ? AND tipoUsuario = 1 LIMIT 1";
        var cmd = this.db.prepare(cmdSQL, [facebookId]);
                
        cmd.get(function (err, row) {
          if (err) {
            throw err;
          } else {
            if (row) {
              user.actualizarValores(row);
              callback(user);
            } else {
              return callback(null);
            }
          }
        });
    },

    getUserByEmail: function (email, callback) {
        var cmdSQL = "SELECT * FROM usuarios WHERE email = ? LIMIT 1";
        var cmd = this.db.prepare(cmdSQL, [email]);

        cmd.get(function (err, row) {
          if (err) {
            throw err;
          } else {
            if (row) {
              user.actualizarValores(row);
              callback(user);
            }
            else {
              callback(null);

            }
          }
        });
        
    },
    
    createUser: function (cb) {
        var cmdSQL = "INSERT INTO usuarios (idUsuarios, tipoUsuario, email, password, fb_id, fb_email, fb_token, fb_name, fb_firstName, fb_lastname)" + 
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        var param = [
            null,
            this.tipoUsuario,
            this.email,
            this.password,
            this.fb_id,
            this.fb_email,
            this.fb_token,
            this.fb_name,
            this.fb_firstname,
            this.fb_lastname
        ];
        
        user.db.run(cmdSQL, param, function (err) {
          if (err) {
            cb(err);
          }
          else {
            user.idUsuarios = this.lastID;
            cb(false);
          }
        });
    },

    updateUser: function (cb) {
      var cmdSQL = "UPDATE usuarios " +
      "SET tipoUsuario = ?" +
      ", email = ?" +
      ", password = ?" +
      ", fb_id = ?" +
      ", fb_email = ?" +
      ", fb_token = ?" +
      ", fb_name = ?" +
      ", fb_firstName = ?" +
      ", fb_lastname = ?" +
      "WHERE idUsuarios = ?";

        var param = [
            this.tipoUsuario,
            this.email,
            this.password,
            this.fb_id,
            this.fb_email,
            this.fb_token,
            this.fb_name,
            this.fb_firstname,
            this.fb_lastname,
            this.idUsuarios
        ];
        
        user.db.run(cmdSQL, param, function (err) {
          if (err) {
            cb(err);
          } else {
            console.log(user.db.run)
            cb(false);
          }
        });
    },
    
    generateHash: function (password) {
        return this.bcrypt.hashSync(password, this.bcrypt.genSaltSync(8), null);
    },

    validPassword: function (password) {
        return this.bcrypt.compareSync(password, this.password);

    }
}

 
module.exports = user;

