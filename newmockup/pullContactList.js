// Pull user's contact list to client
var User = require('../newmockup/user');

module.exports = function(callback, username){

	console.log("In pullContactList");

	// Edit user's contact list if username is passed in correctly
	User.findOne({ 'username' : username },
				function(err, user) {
					if (err) {
						console.log("Error while attempting to find username in db" + err);
						throw err;
					}
					if (user) {
						//TODO: parse favorites string here and don't add if user is already added ("Add Contact" button should never show up, though)
						console.log(username + '\'s contact list has been pulled from the server');
						console.log(username + '\'s contact list is: ' + user.favorites);
						callback(user.favorites);				

					} else {
							console.log('Current user doesn\'t exist in database');
							throw err;
					}
				}
	);
				
	console.log("Fell through pullContactList");
}