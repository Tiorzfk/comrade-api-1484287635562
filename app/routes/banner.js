var banner = require('../controllers/banner');

module.exports = function(app) {

    app.route('/banner').get(banner.banner);

};
