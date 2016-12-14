var user = require('../controllers/user');
var jwt = require('jsonwebtoken');
var cektokenemail = require('../../config/cektokenemail');
var cektoken = require('../../config/cektoken');

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    return res.json({
        result: 'forbidden',
        status_code: 403,
        message: "You dont't have access"
    });
}

module.exports = {
	configure: function(app,passport) {
    //app.route('/user/authenticate').post(user.auth_user);
    app.post('/user/authenticate', passport.authenticate('local-login',{
        successRedirect : '/successlogin', // redirect to the secure profile section
        failureRedirect : '/failurelogin', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/successlogin', function(req, res) {
        var token = jwt.sign(req.user[0], 'comradeapp', {
            //expiresIn: "24h" // expires in 24 hours
        });
        return res.json({
            result: 'Success',
            status_code: 200,
            token: token,
            id_user: req.user[0].id_user,
            nama: req.user[0].nama,
            email: req.user[0].email,
            password: req.user[0].password,
            jenis_kelamin: req.user[0].jk,
            telp: req.user[0].telp,
            tgl_lahir: req.user[0].tgl_lahir,
            status: req.user[0].status,
            jenis_user: req.user[0].jenis_user,
            foto: req.user[0].foto
        });
    });

    app.get('/failurelogin', function(req, res) {
        return res.json({result: 'Failed',status_code:400, message: ''+req.flash('loginMessage') });
    });

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect : '/successlogin',
        failureRedirect : '/failurelogin'
    }));

    /*app.post('/user/register', passport.authenticate('local-signup',{
        successRedirect : '/successSignup',
        failureRedirect : '/failureSignup',
        failureFlash : true
    }));

    app.get('/successSignup', function(req, res) {
        return res.json({
            result: 'Created',
            status_code: 201,
            message: 'Registration is successful, check your email to activate your account.'
        });
    });

    app.get('/failureSignup', function(req, res) {
        return res.json({result: 'Failed', message: req.flash('signupMessage') });
    });*/
    app.route('/user/auth').post(user.auth_user);

    app.route('/user/register').post(user.register);

    app.route('/confirm/:email').all(cektokenemail.cektoken).get(user.confirmation);

    app.route('/user/profile').all(cektoken.cektoken).get(user.profile);

		app.route('/user/profile/:id').all(cektoken.cektoken).get(user.profileID).post(user.setting_profile);

    app.route('/user/change_password/:id').all(cektoken.cektoken).post(user.change_password);

    app.route('/user/premium').get(user.userPremium);

    app.route('/user/premium').post(user.postUserPremium);

    app.route('/token_fcm').post(user.token_fcm);
    //app.route('/user/sahabat_odha').all(token_cek).get(user.sahabat_odha);
	}
};
