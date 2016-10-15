var sa = require('../controllers/sahabatodha');
var jwt = require('jsonwebtoken');
var cek = require('../../config/cektoken');

module.exports = {
  configure: function(app) {
    app.route('/user/sahabatodha').all(cek.cektoken).get(sa.allsahabatodha);

    app.route('/user/sahabatodha/user/:iduser').all(cek.cektoken).get(sa.allsahabatodhauser);

    app.route('/user/sahabatodha/:iduser').all(cek.cektoken).get(sa.sahabatodha).put(sa.editsahabatodha);

    app.route('/user/sahabatodha/:iduser/testimoni').all(cek.cektoken).get(sa.testimoni);

    app.route('/user/sahabatodha/rate').all(cek.cektoken).post(sa.rate);
  }
};
