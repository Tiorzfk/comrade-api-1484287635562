var lokasi = require('../controllers/lokasi_obat');
var jwt = require('jsonwebtoken');
var cek = require('../../config/cektoken');

module.exports = {
  configure: function(app) {
    app.route('/lokasi_obat').get(lokasi.lokasi_obat);

    app.route('/lokasi_obat/:id').get(lokasi.idlokasi_obat);
  }
};
