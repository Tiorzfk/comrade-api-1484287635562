var healbox = require('../controllers/healbox');

module.exports = {
  configure: function(app) {
    app.route('/reminder').get(healbox.reminder).post(healbox.reminderPost);

    app.route('/healbox').post(healbox.updateID);

    app.route('/arv_reminder').post(healbox.arv_reminder);

    app.route('/arv_reminder/:id').put(healbox.put_arv_reminder);

    app.route('/healbox/:id_user').get(healbox.healboxID);

  }
};
