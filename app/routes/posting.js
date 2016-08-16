var posting = require('../controllers/posting');

module.exports = function(app) {
    app.route('/posting').get(posting.posting);

    app.route('/posting/kategori/:kategori').get(posting.kategori);

    app.route('/posting/:id').get(posting.postingID);

};
