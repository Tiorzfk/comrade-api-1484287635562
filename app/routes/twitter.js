var twitter = require('../controllers/twitter');

module.exports = function(app) {
    app.route('/sentiment').get(twitter.sentimen);
};
