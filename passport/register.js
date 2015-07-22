//Tutsplus code (for now)
var LocalStrategy = require('passport-local').Strategy;
var User = require('../newmockup/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('register', new LocalStrategy({
		passReqToCallback: true 
	},
	//TODO: find a way to validate that username and password fields have values on front or backend
	function(req, username, password, done) {
		findOrCreateUser = function(){
			// check if username exists in mongo
			User.findOne({ 'username' : username },
				function(err, user) {
					if (err) {
						console.log("Error during registration" + err);
						return done(null, false, req.flash('message', 'Unexpected error during registration'));
					}
					if (user) {
						console.log('Username already exists in database: ' + username);
						return done(null, false, req.flash('message', 'User already exists'));
					} else {
						// create new user with credentials
						console.log("Creating new user");
						var newUser = new User();

						newUser.username = username;
						newUser.password = createHash(password);
						newUser.email = req.param('email');

						newUser.save(function(err) {
							if (err) {
								console.log('Error saving new user: ' + err);
								throw err;
							}
							console.log('Registration of new user successful');
							return done(null, newUser);
						});
					} 
				}
			);
		};
		console.log("About to call findOrCreateUser");
		// Delay executing findOrCreateUser until next event loop revolution
		process.nextTick(findOrCreateUser);
	}));
	
	// User bCrypt to encrypt new user password
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}