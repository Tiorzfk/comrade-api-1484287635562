var posting = require('../controllers/posting');

module.exports = {
  configure: function(app) {
    app.route('/posting/page/:page').get(posting.posting);

    // app.route('/posting/kategori/:kategori').get(posting.kategoriAll);
    // app.route('/posting/kategori/:kategori/page/:page').get(posting.kategori);
    app.route('/posting/kategori/:kategori/:lang/page/:page').get(posting.postingMongo);

    //app.route('/posting/:id').get(posting.postingID).post(posting.editPosting);

    //app.route('/posting').post(posting.simpanPosting).delete(posting.deletePosting);

    //admin
    app.route('/admapp/berita').get(posting.admappBerita);
    app.route('/admapp/postingAll').get(posting.admappPostingAll);
    app.route('/admapp/artikel').get(posting.admappArtikel);
    app.route('/verifikasi_posting').post(posting.VerifikasiPosting);
    

    //mongodb
    app.route('/posting/:id').get(posting.postingIDMongo).post(posting.editPostingMongo);
    app.route('/postingMongo/kategori/:kategori/:lang/page/:page').get(posting.postingMongo);
    app.route('/posting').post(posting.simpanPostingMongo).delete(posting.deletePostingMongo);
    app.route('/deleteposting').post(posting.deletePostingMongo)
    //buat web
    app.route('/postingMongo5/kategori/:kategori').get(posting.posting5Mongo);
    app.route('/postingMongo/kategori/:kategori').get(posting.postingAllMongo);
    
  }
};
