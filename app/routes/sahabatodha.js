var sa = require('../controllers/sahabatodha');
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
    res.json({
        result: 'forbidden',
        status_code: 403,
        message: "You dont't have access"
    });
}

module.exports = function(app) {
    app.route('/user/sahabatodha').all(isLoggedIn,token_cek).get(sa.allsahabatodha);

    app.route('/user/sahabatodha/:iduser').all(isLoggedIn,token_cek).get(sa.sahabatodha);

    app.route('/user/sahabatodha/:iduser').all(isLoggedIn,token_cek).put(sa.editsahabatodha);

    app.route('/user/sahabatodha/rate/:iduser').all(isLoggedIn,token_cek).post(sa.rate);
};
