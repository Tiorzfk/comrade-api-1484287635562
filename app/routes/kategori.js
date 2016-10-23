var kategori = require('../controllers/kategori');

module.exports = {
  configure: function(app) {
    app.route('/kategori').get(kategori.kategori);
  }
};
