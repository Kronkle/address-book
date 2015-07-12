passport.use('login', new LocalStrategy({
	passReqToCallback: true
	},
	function(req, username, password, done) {
		// verify that username exists in mongo
		User.findOne({ 'username' : username },
			function(err, user) {
				if (err)
					return done(err);
				if (!user) {
					console.log('Username not found: ' + username);
					return done(null, false, req.flash('message', 'User not found'));
				}
				if (!isValidPassword(user, password)){
					console.log('Incorrect password entered');
					return done(null, false, req.flash('message', 'Invalid Password'));
				}
				// Username is found and correct password entered
				return done(null, user);
			});
}));