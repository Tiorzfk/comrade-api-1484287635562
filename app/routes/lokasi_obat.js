var lokasi = require('../controllers/lokasi_obat');
var jwt = require('jsonwebtoken');
var cek = require('../../config/cektoken');

module.exports = function(app) {

    app.route('/lokasi_obat').all(cek.cektoken).get(lokasi.lokasi_obat);

    app.route('/lokasi_obat/:id').all(cek.cektoken).get(lokasi.idlokasi_obat);

};
