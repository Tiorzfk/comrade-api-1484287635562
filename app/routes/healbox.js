var healbox = require('../controllers/healbox');

module.exports = {
  configure: function(app) {
    app.route('/reminder').get(healbox.reminder).post(healbox.reminderPost);

    app.route('/healbox').post(healbox.updateID);

  }
};
