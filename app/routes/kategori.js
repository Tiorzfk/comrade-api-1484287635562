var kategori = require('../controllers/kategori');

module.exports = function(app) {
    app.route('/kategori').get(kategori.kategori);

};
