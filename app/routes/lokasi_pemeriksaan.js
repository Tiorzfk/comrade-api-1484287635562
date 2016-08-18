var lokasi = require('../controllers/lokasi_pemeriksaan');
var jwt = require('jsonwebtoken');
var cek = require('../../config/cektoken');
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

module.exports = function(app) {

    app.route('/lokasi_pemeriksaan').all(cek.cektoken).get(lokasi.lokasi_pemeriksaan);

    app.route('/lokasi_pemeriksaan/:id').all(cek.cektoken).get(lokasi.idlokasi_pemeriksaan);

};
