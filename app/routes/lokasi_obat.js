var lokasi = require('../controllers/lokasi_obat');
var jwt = require('jsonwebtoken');

function token_cek(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

  	// decode token
  	if (token) {

    	// verifies secret and checks exp
    	jwt.verify(token, 'comradeapp', function(err, decoded) {      
    	  if (err) {
    	    return res.json({ success: false, message: 'Failed to authenticate token.' });    
    	  } else {
    	    // if everything is good, save to request for use in other routes
    	    req.decoded = decoded;    
    	    next();
    	  }
    	});

  	} else {

    	// if there is no token
    	// return an error
    	return res.status(403).send({ 
    	    success: false, 
    	    message: 'No token provided.' 
    	});
    
  	}
}

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

    app.route('/lokasi_obat').all(token_cek).get(lokasi.lokasi_obat);

    app.route('/lokasi_obat/:id').all(token_cek).get(lokasi.idlokasi_obat);

};
