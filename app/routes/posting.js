var posting = require('../controllers/posting');

module.exports = {
  configure: function(app) {
    app.route('/posting/page/:page').get(posting.posting);

    app.route('/posting/kategori/:kategori/page/:page').get(posting.kategori);

    app.route('/posting/:id').get(posting.postingID);

    app.route('/tesxml').get(posting.tes);
  }
};
