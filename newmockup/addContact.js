// Add user to contact list ("favorites" property)
var User = require('../newmockup/user');

module.exports = function(callback, username, userToAdd){

	// Edit user's contact list if username is passed in correctly
	User.findOne({ 'username' : username },
		function(err, user) {

			// Handle for various error scenarios
			if (err) {
				console.log("Error while attempting to add contact" + err);
				callback();
			}

			// Add user to contact list if he/she exists in database
			if (user) {

				user.favorites = user.favorites + userToAdd + ", ";
				console.log(userToAdd + ' has been added to ' + username + '\'s contact list');
				console.log(username + '\'s contact list is: ' + user.favorites);

				user.save(function(err) {

					if (err) {
						console.log('Error saving user\'s contact list: ' + err);
						throw err;
					}

					console.log('New contact list has been saved to the database');
					callback();
				});

			} else {
				console.log('Current user doesn\'t exist in database');
				callback();
			}
		}
	);
}