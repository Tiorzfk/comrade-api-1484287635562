var event = require('../controllers/event');

module.exports = {
  configure: function(app) {
    app.route('/detailevent/:id').get(event.eventID);
    app.route('/event/:tipe/page/:page').get(event.event);

    app.route('/event/:tipe/:lang/page/:page').get(event.eventMongo);
    
    //web
    app.route('/eventMongo/:tipe').get(event.eventMongoAll);

    //admin
    app.route('/admapp/event').get(event.admappEvent);

    app.route('/event').get(event.eventAll).post(event.postEventMongo);
    app.route('/event/:id').get(event.eventIDMongo).put(event.putEventMongo).delete(event.deleteMongo);
    app.route('/deleteevent/:id').post(event.deleteMongo);
  }
};
