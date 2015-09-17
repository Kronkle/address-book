var LocalStrategy = require('passport-local').Strategy;
var User = require('../newmockup/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) {

		// Verify that username exists in database
		User.findOne({ 'username' : username },
			function(err, user) {

				// Handle for various error scenarios
				if (err) {
					console.log("Error retrieving username from database");
					return done(err, false, { message: 'Error retrieving username from database.' });
				}

				if (!user) {
					console.log('Username not found: ' + username);
					return done(null, false, { message: 'Username ' + username + ' not found.' });
				}

				if (!isValidPassword(user, password)){
					console.log('Invalid password entered');
					return done(null, false, { message: 'Invalid password entered.'});
				}

				// Username is found and correct password entered
				return done(null, user);
			}
		);
	}));

	// Compare supplied password with encrypted password associated with account
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	}

}

