var LocalStrategy   = require('passport-local').Strategy,
    db = require('./db').DB,
    bcrypt = require('bcrypt-nodejs');


module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id_user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.getConnection(function(err,koneksi){
            koneksi.query('SELECT * FROM user where id_user= ?',[id],function(err,user){
                done(err, user);
            });
        });
    });

    /*passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, nama, password, jenis_kelamin, tgl_lahir, telp, jenis_user, done) {
        var password = 
        var data = {
            nama: nama,
            email: email,
            password: password,
            jk: jenis_kelamin,
            tgl_lahir: tgl_lahir,
            telp: telp,
            status: "0",
            jenis_user: jenis_user
        }
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        db.getConnection(function(err,koneksi){
            koneksi.query("select * from user where email = '"+email+"'",function(err,rows){
                if (err)
                    return done(err);
                 if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUserMysql = new Object();
                
                    newUserMysql.email    = email;
                    newUserMysql.password = password;
                        koneksi.query('INSERT INTO user SET ? ',data,function(err,rows){   
                            if(err)      
                                return done(null, false, req.flash('signupMessage', err));

                            return done(null, newUserMysql);
                            koneksi.release();
                        }); 
                }   
            });
        });
    }));*/

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
            req.checkBody("email", "Enter a valid email address.").isEmail();
            var errors = req.validationErrors();
            if (errors)
              return done(null, false, req.flash('loginMessage', errors));
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.getConnection(function(err,koneksi){
                koneksi.query('SELECT * FROM user where email = ? ',[email],function(err,user){
                    // if there are any errors, return the error before anything else
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user.length)
                        return done(null, false, req.flash('loginMessage', 'Authentication failed. Email not found..'));

                    var validPassword = bcrypt.compareSync(password, user[0].password);
                    // if the user is found but the password is wrong
                    if (!validPassword)
                        return done(null, false, req.flash('loginMessage', 'Authentication failed. Wrong password.')); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, user[0]);  
                        
                    koneksi.release();
                });
            });
        
    }));

};