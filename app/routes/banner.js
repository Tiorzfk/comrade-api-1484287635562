var banner = require('../controllers/banner');

module.exports = function(app) {

    app.route('/banner/list').get(banner.banner);

};
