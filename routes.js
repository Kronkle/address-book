require('colors');
var express = require('express'),
    path = require('path'),
    passport = require('passport'),
    addContact = require(path.join(__dirname,'newmockup/addContact')),
    deleteContact = require(path.join(__dirname,'newmockup/deleteContact')),
    people = require(path.join(__dirname, 'data/people.json'));

// Create an Express Router to utilize HTTP routing methods
var router = express.Router();

// Set response's login object to request's user object for displaying username in views
function loggedIn(req, res, next) {
    if (req.user) {
    	res.locals.login = req.user;
        next();
    } else {
        next();
    }
}

// Serve static assets for both versions of app
router.use('/mockup/', express.static(path.join(__dirname, 'mockup')));
router.use('/newmockup/', express.static(path.join(__dirname, 'newmockup')));

// Serve profile.js and other views for retrieval on the client-side
router.use('/views/', express.static(path.join(__dirname, 'views')));

// Return people data as a set of JSON objects
router.get('/api/people', function(req, res){
    res.end(JSON.stringify(people, null, '    '));
});

// Render index view when /newmockup is requested
router.get('/newmockup', function(req, res){
	res.render('index');
});

// Authenticate login and registration via Passport
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

// Attempt to add/delete person to user's contact list via addContact/deleteContact middleware
router.post('/newmockup/addContact', function(req, res){
	console.log("Current user is " + req.user.username);
	console.log("Contact to be added is " + req.body.name);
	addContact(function() {
		console.log("Contact added: " + req.body.name);
		res.end("Contact added");
	}, req.user.username, req.body.name);		
});

router.post('/newmockup/deleteContact', function(req,res){
	console.log("Current user is " + req.user.username);
	console.log("Contact to be deleted is " + req.body.name);
	deleteContact(function() {
		console.log("Contact deleted: " + req.body.name);
		res.end("Contact deleted");
	}, req.user.username, req.body.name);	
});

// Retrieve contact list for rendering profiles properly after user login
router.post('/newmockup/pullContactList', function(req, res){
	console.log("Pulling contact list for " + req.user.username);
	res.send(req.user.favorites)
});

// Render customized view after user login
router.get('/newmockup/loggedIn', loggedIn, function(req, res){
	console.log(("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!").red);
	console.log(("Currently logged in as " + res.locals.login.username).red);
	console.log(("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!").red);
	res.render('loggedIn', {username: res.locals.login.username});
});

// Render special view for login/registration failures
router.get('/newmockup/loginFailure', function(req, res){
	res.render('userFailure', {messages: req.flash('error'), loginFailure: true});
});

router.get('/newmockup/registerFailure', function(req, res){
	res.render('userFailure', {messages: req.flash('error'), registerFailure: true});
});

// Render index view after user logout
router.post('/newmockup/logout', function(req, res){
	res.render('index');
});

// Assign configured router object to module.exports for importing into other files
module.exports = router;