// Remove user from contact list ("favorites" property)
var User = require('../newmockup/user');

module.exports = function(callback, username, userToDelete){

	// Edit user's contact list if username is passed in correctly
	User.findOne({ 'username' : username },
		function(err, user) {

			// Handle for 
			if (err) {
				console.log("Error while attempting to delete contact" + err);
				callback();
			}

			// Remove user from contact list if he/she exists in database
			if (user) {

				var userMatch = user.favorites.indexOf(userToDelete);

				if (userMatch) {

					var userToDeleteElm = userToDelete.concat(", ");
					var regExp = new RegExp(userToDeleteElm, "g");

					user.favorites = user.favorites.replace(regExp, '');

				} else {
					console.log("Can't find " + userToDelete + " in " + username + "'s contact list");
					throw err;
				}

				console.log(userToDelete + ' has been deleted from ' + username + '\'s contact list');
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