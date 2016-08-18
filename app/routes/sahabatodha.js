var sa = require('../controllers/sahabatodha');
var jwt = require('jsonwebtoken');
var cek = require('../../config/cektoken');

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.json({
        result: 'forbidden',
        status_code: 403,
        message: "You dont't have access"
    });
}

module.exports = function(app) {
    app.route('/user/sahabatodha').all(cek.cektoken).get(sa.allsahabatodha);

    app.route('/user/sahabatodha/:iduser').all(cek.cektoken).get(sa.sahabatodha);

    app.route('/user/sahabatodha/:iduser').all(cek.cektoken).put(sa.editsahabatodha);

    app.route('/user/sahabatodha/rate/:iduser').all(cek.cektoken).post(sa.rate);
};
