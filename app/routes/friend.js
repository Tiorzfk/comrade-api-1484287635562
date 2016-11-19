var friend = require('../controllers/friends');
var cek	   = require('../../config/cektoken');

module.exports = {
  configure: function(app) {
    app.route('/friends/:id_user').all(cek.cektoken).get(friend.getfriend)
    app.route('/friends/sahabatodha/:id_user').all(cek.cektoken).get(friend.getfriendsahabatodha);;
    app.route('/addfriend').all(cek.cektoken).post(friend.addfriends);
    app.route('/friends/sahabatodha/konfirmasi').all(cek.cektoken).post(friend.konfirmasi);
    app.route('/friends/sahabatodha/hapus_kontak').all(cek.cektoken).delete(friend.hapuskontak);
  }
};
