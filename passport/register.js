var LocalStrategy = require('passport-local').Strategy;
var User = require('../newmockup/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
		passReqToCallback: true 
	},
	function(req, username, password, done) {
		findOrCreateUser = function(){
			
		}
	}

	))
}