var banner = require('../controllers/banner');

module.exports = {
  configure: function(app) {
    app.route('/listbanner').get(banner.banner);

    app.route('/banner').post(banner.postBanner);
  }
};
