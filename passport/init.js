//Tutsplus code (for now)
var login = require('./login');
var register = require('./register');
var User = require('../newmockup/user');

module.exports = function(passport){
	// Serialize and deserialize users for persistent user sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user: ' + user);
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			console.log('deserializing user: ' + user);
			done(err, user);
		});
	});

	// Initialize local login and register strategies
	login(passport);
	register(passport);
}