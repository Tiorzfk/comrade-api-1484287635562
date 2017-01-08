var posting = require('../controllers/posting');

module.exports = {
  configure: function(app) {
    app.route('/posting/page/:page').get(posting.posting);

    app.route('/posting/kategori/:kategori').get(posting.kategoriAll);
    app.route('/posting/kategori/:kategori/page/:page').get(posting.kategori);
    app.route('/posting/kategori/:kategori/:lang/page/:page').get(posting.postLang);

    //app.route('/posting/:id').get(posting.postingID).post(posting.editPosting);

    //app.route('/posting').post(posting.simpanPosting).delete(posting.deletePosting);

    app.route('/admapp/berita').get(posting.admappBerita);
    app.route('/admapp/artikel').get(posting.admappArtikel);

    //mongodb
    app.route('/posting/:id').get(posting.postingIDMongo).post(posting.editPostingMongo);
    app.route('/postingMongo/kategori/:kategori/:lang/page/:page').get(posting.postingMongo);
    //buat web
    app.route('/postingMongo5/kategori/:kategori').get(posting.posting5Mongo);
    app.route('/postingMongo/kategori/:kategori').get(posting.postingAllMongo);
    
    app.route('/posting').post(posting.simpanPostingMongo).delete(posting.deletePostingMongo);
  }
};
