// Add user to favorites
var User = require('../newmockup/user');

module.exports = function(callback, username, userToAdd){

	console.log("In addContact");

	// Edit user's contact list if username is passed in correctly
	User.findOne({ 'username' : username },
				function(err, user) {
					if (err) {
						console.log("Error while attempting to add contact" + err);

						//TODO: pass in param indicating failure
						callback();
					}
					if (user) {
						//TODO: parse favorites string here and don't add if user is already added ("Add Contact" button should never show up, though)
						user.favorites = user.favorites + userToAdd + ", ";
						console.log(userToAdd + ' has been added to ' + username + '\'s contact list');
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
				
	console.log("Fell through addContact");
}