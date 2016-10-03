var LocalStrategy   = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    db = require('./db'),
    bcrypt = require('bcrypt-nodejs');

var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        //console.log(user);
        done(null, user.google_id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.getConnection(function(err,koneksi){
          if (err) throw err;
            koneksi.query('SELECT * FROM user where google_id= ?',[id],function(err,user){
                done(err, user);
            });
            koneksi.release();
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
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.getConnection(function(err,koneksi){
              if (err) throw err;
                koneksi.query('SELECT * FROM user where email = ? ',[email],function(err,user){
                    // if there are any errors, return the error before anything else
                    if (err)
                        return done(err);

                    req.checkBody("email", "Enter a valid email address.").isEmail();
                    var errors = req.validationErrors();
                    if (errors)
                      return done(null, false, req.flash('loginMessage', errors[0].msg));

                    // if no user is found, return the message
                    if (!user.length)
                        return done(null, false, req.flash('loginMessage', 'Authentication failed. Email not found..'));

                    var validPassword = bcrypt.compareSync(password, user[0].password);
                    // if the user is found but the password is wrong
                    if (!validPassword)
                        return done(null, false, req.flash('loginMessage', 'Authentication failed. Wrong password.')); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, user[0]);
                });
                koneksi.release();
            });
    }));

    passport.use('google', new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {
        //console.log(profile);
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            console.log('email : '+profile.id)
            var data = {
                nama: profile.displayName,
                email: profile.emails[0].value,
                jenis_user: 'User',
                status  : '1',
                foto: profile.photos[0].value,
                google_id: profile.id
            }
            // try to find the user based on their google id
            db.getConnection(function(err,koneksi){
              if (err) throw err;
                koneksi.query("SELECT * FROM user where email ='"+profile.emails[0].value+"'",function(err,user){
                    if (err)
                        return done(err);

                    if (user.length) {
                        console.log('user sudah ada di db');
                        // if a user is found, log them in
                        return done(null, user[0]);
                    }
                        console.log('user belum ada di db');
                        // if the user isnt in our database, create a new user

                        koneksi.query('INSERT INTO user SET ? ',data,function(err,result){
                            if (err) {
                               return done(null, false);
                               /*return res.json({
                                result: 'Failed',
                                status: 403,
                                message: 'Invalid Data',
                                errors: err
                               });*/
                            }
                            return done(null, data);
                        });

                });
                koneksi.release();
            });
        });

    }));

};
