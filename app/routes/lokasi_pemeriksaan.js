var lokasi = require('../controllers/lokasi_pemeriksaan');
var jwt = require('jsonwebtoken');
var cek = require('../../config/cektoken');

module.exports = function(app) {

    app.route('/lokasi_pemeriksaan').all(cek.cektoken).get(lokasi.lokasi_pemeriksaan);

    app.route('/lokasi_pemeriksaan/:id').all(cek.cektoken).get(lokasi.idlokasi_pemeriksaan);

};
