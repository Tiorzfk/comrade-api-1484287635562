var twitter = require('../controllers/twitter');

module.exports = {
  configure: function(app) {
    app.route('/sentiment').get(twitter.sentimenbak);
    app.route('/sentiment/:page').get(twitter.sentimen);
    app.route('/sentiment/en/page/:page').get(twitter.ambil_eng2);
    app.route('/sentiment/id/page/:page').get(twitter.sentimen);
    //app.route('/testing').get(twitter.ambil_eng2);

    app.route('/ambiltweet').get(twitter.ambiltweet);
  }
};
