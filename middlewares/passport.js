const passport			    = require('passport');
const localStrategy		    = require('passport-local').Strategy;
const bcrypt			    = require('bcrypt');
const User              	= require('../models/userModel')
const passportJwt			= require('passport-jwt')
const ExtractJwt			= passportJwt.ExtractJwt
const StrategyJwt			= passportJwt.Strategy

// when we login we have to serilize and deserilize the user
// receives the "authenticated user" object from the "Strategy" framework, 
// and attach the authenticated user to req.session.passport.user.{..}
passport.serializeUser(function (user, done) {
	console.log("serializing " + user.username)
  	done(null, user)
})
// Now anytime we want the user details for a session, 
//we can simply get the object that is stored in “req.session.passport.user.{..}
// We can extract the user information from the {..} object and perform additional
// search our database for that user to get additional user information, 
// or to simply display the user name on a dashboard.
passport.deserializeUser(function (obj, done) {
	/*
	User.findById(id, function (err, user) { // find User (from UserSchema) by id 
		done(err, user); //
	});
	*/
	console.log("deserializing " + obj)
  	done(null, obj)
});

// login authentication - username and password check if matches with dbs
passport.use('local', new localStrategy(async function (Username, Password, done) {
	User.findOne({ username: Username }, await function (err, userInfo) { 
		
		console.log(userInfo)

		if (err)  		return done(null, err) 
		if (!userInfo)	return done(null, false, { message: 'Incorrect username.' })
        // if everything is okay and username exists then compare passwords from login and db
		bcrypt.compare(Password, userInfo.password, function (err, res) {
			console.log(Password)
			console.log(userInfo.password)
			console.log(res)

			if (err) return done(null, err);
            // if response from compare is false then the password doesnt match 
			if (res === false) return done(null, false, { message: 'Incorrect password.' });
			
            // if password is compare with db successfull then we can sign in
			if (res === true) return done(null, userInfo);
		})
	})
}))

// JWT Authorization
passport.use( new StrategyJwt({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET_KEY
},
function (jwtPayload, done) {
	return User.findOne({ where: { id: jwtPayload.id}})
		.then((user)=> {
			return done(null, user)
		}).catch((err) => {
			return done(err)
		})
}
)), 
module.exports = passport