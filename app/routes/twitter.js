var twitter = require('../controllers/twitter');

module.exports = {
  configure: function(app) {
    app.route('/sentiment').get(twitter.sentimenbak);
    app.route('/sentiment/:page').get(twitter.sentimen);
    app.route('/sentiment/en/page/:page').get(twitter.sentiment_eng);
    app.route('/testing').post(twitter.coba);
  //  app.route('/ambiltweet').get(twitter.ambiltweet);
  }
};
