'use strict';

var user = {
    idUsuarios: 0,
    tipoUsuario: 0, // O normal
    email: String,
    password: String,
    id: String,
    token: String,
    name: String,
    displayName: String,
    username: String,
    db: require('./models.js'),
    bcrypt: require('bcrypt-nodejs'),
    
    usuarioBlank: function () {
        
        this.idUsuarios = 0;
        this.tipoUsuario = 0; // O normal
        this.email = "";
        this.password = null;
        this.id = null;
        this.token = null;
        this.name = null;
        this.displayName = null;
        this.username = null;
    },
    
    actualizarValores: function (usrObj) {
      for (var p in usrObj) {
        this[p] = usrObj[p];
      }
    },
    
    getUserById: function (userId, callback) {
        var cmdSQL = "SELECT * FROM usuarios WHERE idUsuarios = ?";
        var cmd = this.db.prepare(cmdSQL, [userId]);
        
        cmd.get(function (error, row) {
          if (error) {
            throw error;
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
        var cmdSQL = "SELECT * FROM usuarios WHERE id = ? AND tipoUsuario = 1 LIMIT 1";
        var cmd = this.db.prepare(cmdSQL, [facebookId]);
                
        cmd.get(function (error, row) {
          if (error) {
            throw error;
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
        var cmdSQL = "SELECT * FROM usuarios WHERE email = ?";
        var cmd = this.db.prepare(cmdSQL);

        cmd.bind(email);
        
        cmd.get(function (error, row) {
          if (error) {
            throw error;
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
        var cmdSQL = "INSERT INTO usuarios (idUsuarios, tipoUsuario, email, password, id, token, name, displayName, username)" + 
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        var param = [
            null,
            this.tipoUsuario,
            this.email,
            this.password,
            this.id,
            this.token,
            this.name,
            this.displayName,
            this.username
        ];
        
        user.db.run(cmdSQL, param, function (error) {
          if (error) {
            cb(error);
          }
          else {
            user.idUsuarios = this.lastID;
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

