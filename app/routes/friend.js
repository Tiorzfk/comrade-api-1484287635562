var friend = require('../controllers/friends');
var cek	   = require('../../config/cektoken');

module.exports = function(app) {
    app.route('/friends/:id_user').all(cek.cektoken).get(friend.getfriend)
    app.route('/friends/sahabatodha/:id_user').all(cek.cektoken).get(friend.getfriendsahabatodha);;
    app.route('/addfriend').all(cek.cektoken).post(friend.addfriends);
};
