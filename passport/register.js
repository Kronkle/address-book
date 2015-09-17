var LocalStrategy = require('passport-local').Strategy;
var User = require('../newmockup/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('register', new LocalStrategy({
		passReqToCallback: true 
	},
	function(req, username, password, done) {
		findOrCreateUser = function(){

			// Check if username exists in database
			User.findOne({ 'username' : username },
				function(err, user) {

					// Handle for various error scenarios
					if (err) {
						console.log("Error during registration" + err);
						return done(null, false, { message: 'Unexpected error occurred.'});
					}

					if (user) {
						console.log('Username already exists in database: ' + username);
						return done(null, false, { message: 'Username already exists.'});

					// Create new user with credentials if username isn't already in database
					} else {

						var newUser = new User();

						newUser.username = username;
						newUser.password = createHash(password);
						newUser.email = req.param('email');
						newUser.favorites = " ";

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

		// Run findOrCreate user asynchronously (but before other I/O events)
		process.nextTick(findOrCreateUser);
	}));
	
	// Encrypt password for new user to store in database
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}