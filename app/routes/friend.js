var friend = require('../controllers/friends');
var cek	   = require('../../config/cektoken');

module.exports = function(app) {
    app.route('/friends/:id_user').get(friend.getfriend);
    app.route('/friends').post(friend.addfriends);
};
