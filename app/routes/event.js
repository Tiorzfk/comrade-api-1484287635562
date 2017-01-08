var event = require('../controllers/event');

module.exports = {
  configure: function(app) {
    app.route('/detailevent/:id').get(event.eventID);
    app.route('/event/:tipe/page/:page').get(event.event);

    app.route('/event/:tipe/:lang/page/:page').get(event.eventMongo);
    
    app.route('/eventMongo/:tipe').get(event.eventMongoAll);

    //admin
    app.route('/admapp/event').get(event.admappEvent);

    app.route('/event').get(event.eventAll).post(event.postEvent);
    app.route('/event/:id').put(event.putEvent).delete(event.delete);
  }
};
