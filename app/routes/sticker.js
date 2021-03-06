var sticker = require('../controllers/sticker');
var jwt = require('jsonwebtoken');
var cek = require('../../config/cektoken');


module.exports = {
  configure: function(app) {
    app.route('/sticker/page/:page').all(cek.cektoken).get(sticker.sticker);

    app.route('/sendpicsticker').all(cek.cektoken).post(sticker.sendpicsticker);

    app.route('/sendsticker').all(cek.cektoken).post(sticker.sendsticker);

    app.route('/sticker/list').all(cek.cektoken).get(sticker.pic_sticker);
  }
};
