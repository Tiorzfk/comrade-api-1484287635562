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