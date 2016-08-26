var banner = require('../controllers/banner');

module.exports = function(app) {

    app.route('/listbanner').get(banner.banner);

};
