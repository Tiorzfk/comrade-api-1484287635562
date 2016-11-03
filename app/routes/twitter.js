var twitter = require('../controllers/twitter');

module.exports = {
  configure: function(app) {
    app.route('/sentiment').get(twitter.sentimen);
    app.route('/ambiltweet').get(twitter.ambiltweet);
  }
};
