require('colors');
var express = require('express'),
    path = require('path'),
    passport = require('passport'),
    addContact = require(path.join(__dirname,'newmockup/addContact')),
    deleteContact = require(path.join(__dirname,'newmockup/deleteContact')),
    people = require(path.join(__dirname, 'data/people.json'));

var router = express.Router();

// Retrive username for response when user sends a request to login 
function loggedIn(req, res, next) {
    if (req.user) {
    	res.locals.login = req.user;
        next();
    } else {
        next();
    }
}

/* Routes */
router.use('/mockup/', express.static(path.join(__dirname, 'mockup')));
router.use('/newmockup/', express.static(path.join(__dirname, 'newmockup')));

// Adding this route in for retrieving profile.js on the client-side (maybe temporarily)
router.use('/views/', express.static(path.join(__dirname, 'views')));

router.get('/api/people', function(req, res) {
    res.end(JSON.stringify(people, null, '    '));
});

router.get('/newmockup', function(req, res){
	res.render('index');
});

/* Override default behavior with specific redirect options */
router.post('/newmockup/login', passport.authenticate('login', {
	successRedirect: '/newmockup/loggedIn',
	failureRedirect: '/newmockup/loginFailure',
	failureFlash: true
}));

router.post('/newmockup/register', passport.authenticate('register', {
	successRedirect: '/newmockup/loggedIn',
	failureRedirect: '/newmockup/registerFailure',
	failureFlash: true
}));

/* Add favorite to contact list. */
router.post('/newmockup/addContact', function(req, res){
	console.log("Current user is " + req.user.username);
	console.log("Contact to be added is " + req.body.name);
	addContact(function() {
		console.log("Contact added: " + req.body.name);
		res.end("Contact added");
	}, req.user.username, req.body.name);		
});

/* Remove favorite from contact list */
router.post('/newmockup/deleteContact', function(req,res){
	console.log("Current user is " + req.user.username);
	console.log("Contact to be deleted is " + req.body.name);
	deleteContact(function() {
		console.log("Contact deleted: " + req.body.name);
		res.end("Contact deleted");
	}, req.user.username, req.body.name);	
});

/* Pull contact list for logged in users before rendering profiles to display proper state */
router.post('/newmockup/pullContactList', function(req, res){
	console.log("Pulling contact list for " + req.user.username);
	res.send(req.user.favorites)
});

router.get('/newmockup/loggedIn', loggedIn, function(req, res){
	console.log(("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!").red);
	console.log(("Currently logged in as " + res.locals.login.username).red);
	console.log(("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!").red);
	res.render('loggedIn', {username: res.locals.login.username});
});

//TODO: Ensure these flash messages are getting passed in/out properly
router.get('/newmockup/registerFailure', function(req, res){
	res.render('userFailure', {messages: req.flash('message'), registerFailure: true});
});

router.get('/newmockup/loginFailure', function(req, res){
	res.render('userFailure', {messages: req.flash('message'), loginFailure: true});
});

router.post('/newmockup/logout', function(req, res){
	res.render('index');
});

module.exports = router;