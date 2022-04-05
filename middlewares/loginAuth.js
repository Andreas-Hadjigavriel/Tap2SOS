// check if the user isLoggedin/authenticated
// isAuthenticated function checks the session of user, returns true if user is authenticated
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {	
		return next();
	}
	res.send("Access denied: You are not Logged in!")
    //res.redirect('/LogIN');
}

function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) { 
		return next()
	}
	res.redirect('/')
}

module.exports = {
    isLoggedIn, 
    isLoggedOut
}