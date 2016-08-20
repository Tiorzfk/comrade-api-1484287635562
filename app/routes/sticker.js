var sticker = require('../controllers/sticker');
var jwt = require('jsonwebtoken');
var cek = require('../../config/cektoken');


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    return res.json({
        result: 'forbidden',
        status_code: 403,
        message: "You dont't have access"
    });
}

module.exports = function(app) {
    app.route('/sticker').all(isLoggedIn,cek.cektoken).get(sticker.sticker);

    app.route('/sendpicsticker').all(cek.cektoken).post(sticker.sendpicsticker);

    app.route('/sendsticker').all(cek.cektoken).post(sticker.sendsticker);

    app.route('/sticker/list').get(sticker.pic_sticker);
};