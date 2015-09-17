var login = require('./login');
var register = require('./register');
var User = require('../newmockup/user');

module.exports = function(passport){

	// Serialize and deserialize users for persistent login sessions
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// Initialize local login and register strategies
	login(passport);
	register(passport);
}