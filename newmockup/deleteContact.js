// Remove user to favorites
var User = require('../newmockup/user');

module.exports = function(callback, username, userToDelete){

	console.log("In deleteContact");

	// Edit user's contact list if username is passed in correctly
	User.findOne({ 'username' : username },
				function(err, user) {
					if (err) {
						console.log("Error while attempting to delete contact" + err);

						//TODO: pass in param indicating failure
						callback();
					}
					if (user) {
						//TODO: parse favorites string here and don't add if user is already added ("Add Contact" button should never show up, though)
						//user.favorites = user.favorites + userToAdd + ", ";
						var userMatch = user.favorites.indexOf(userToDelete);
						if (userMatch) {
							console.log("Found " + userToDelete + " in contact list");

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

							// Log contact to the console and end HTTP response
							callback();
						});					

					} else {
							console.log('Current user doesn\'t exist in database');

							//TODO: pass in param indicating failure
							callback();
					}
				}
	);

	console.log("Fell through deleteContact");

}