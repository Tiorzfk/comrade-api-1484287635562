var event = require('../controllers/event');

module.exports = {
  configure: function(app) {
    app.route('/detailevent/:id').get(event.eventID);
    app.route('/event/:tipe/page/:page').get(event.event);
    app.route('/event/:tipe/:lang/page/:page').get(event.eventLang);
    app.route('/event').get(event.eventAll).post(event.postEvent);
  }
};
