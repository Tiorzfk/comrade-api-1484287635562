var jwt = require('jsonwebtoken');
module.exports.cektoken=function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

  	// decode token
  	if (token) {

    	// verifies secret and checks exp
    	jwt.verify(token, 'resetpasswordcomrade', function(err, decoded) {
    	  if (err) {
    	    return res.send('Expired');
    	  } else {
    	    // if everything is good, save to request for use in other routes
    	    req.decoded = decoded;
    	    next();
    	  }
    	});

  	} else {

    	// if there is no token
    	// return an error
    	return res.send('No token provided.');

  	}
}
