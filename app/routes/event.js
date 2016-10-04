var event = require('../controllers/event');

module.exports = {
  configure: function(app) {
    app.route('/detailevent/:id').get(event.eventID);
    app.route('/event/:tipe').get(event.event);
  }
};
