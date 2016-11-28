
var sms = require('../controllers/sms');

module.exports = {
  configure: function(app) {
    app.route('/kirimsms').post(sms.kirimsms);
    app.route('/kirimsms/:kategori').post(sms.kirimgroup);
    app.route('/sms/testing').post(sms.testing);
  }
};
