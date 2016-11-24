var sa = require('../controllers/sahabatodha');
var jwt = require('jsonwebtoken');
var cektokenemail = require('../../config/cektokenemail');
var cek = require('../../config/cektoken');

module.exports = {
  configure: function(app) {
    app.route('/user/sahabatodha').all(cek.cektoken).get(sa.allsahabatodha);

    app.route('/user/sahabatodha/user/:iduser').all(cek.cektoken).get(sa.allsahabatodhauser);

    app.route('/user/sahabatodha/:iduser').all(cek.cektoken).get(sa.sahabatodha).post(sa.editsahabatodha);

    app.route('/user/sahabatodha/:iduser/testimoni').all(cek.cektoken).get(sa.testimoni);

    app.route('/user/sahabatodha/rate').all(cek.cektoken).post(sa.rate);

    app.route('/user/sahabatodha/recommend').all(cek.cektoken).post(sa.recommend);

    app.route('/user/daftarsahabatodha').all(cek.cektoken).post(sa.daftarsa);

    app.route('/user/daftarsahabatodhadetail').all(cektokenemail.cektoken).get(sa.daftarsadetail);

    app.route('/confirm_sahabatodha/:email').all(cektokenemail.cektoken).get(sa.confirm);
  }
};
