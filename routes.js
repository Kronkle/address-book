var express = require('express');
var app = express.Router();
var path = require('path');
var passport = require('passport');

/* Configure contact list modules */
var addContact = require(path.join(__dirname,'newmockup/addContact'));
var deleteContact = require(path.join(__dirname,'newmockup/deleteContact'));


function loggedIn(req, res, next) {
    if (req.user) {
    	res.locals.login = req.user;
        next();
    } else {
        next();
    }
}


/* Routes */
app.use('/mockup/', express.static(path.join(__dirname, 'mockup')));
app.use('/newmockup/', express.static(path.join(__dirname, 'newmockup')));

// Adding this route in for retrieving profile.js on the client-side (maybe temporarily)
app.use('/views/', express.static(path.join(__dirname, 'views')));

app.get('/api/people', function(req, res) {
    res.end(JSON.stringify(people, null, '    '));
});



app.get('/newmockup', function(req, res){
	res.render('index');
});

/* Override default behavior with specific redirect options */
app.post('/newmockup/login', passport.authenticate('login', {
	successRedirect: '/newmockup/loggedIn',
	failureRedirect: '/newmockup/loginFailure',
	failureFlash: true
}));

app.post('/newmockup/register', passport.authenticate('register', {
	successRedirect: '/newmockup/loggedIn',
	failureRedirect: '/newmockup/registerFailure',
	failureFlash: true
}));

/* Add favorite to contact list. */
app.post('/newmockup/addContact', function(req, res){
	console.log("Current user is " + req.user.username);
	console.log("Contact to be added is " + req.body.name);
	addContact(function() {
		console.log("Contact added: " + req.body.name);
		res.end("Contact added");
	}, req.user.username, req.body.name);		
});

/* Remove favorite from contact list */
app.post('/newmockup/deleteContact', function(req,res){
	console.log("Current user is " + req.user.username);
	console.log("Contact to be deleted is " + req.body.name);
	deleteContact(function() {
		console.log("Contact deleted: " + req.body.name);
		res.end("Contact deleted");
	}, req.user.username, req.body.name);	
});

/* TODO: Pull contact list for logged in users before rendering profiles to display proper state */
app.post('/newmockup/pullContactList', function(req, res){
	console.log("Pulling contact list for " + req.user.username);
	// Test without the separate module for now
	res.send(req.user.favorites)
});

/* TODO: Display contact list when chosen in preferences menu */
app.post('/newmockup/renderContactList', function(req, res){
	console.log("Contact list chosen");
});

app.get('/newmockup/loggedIn', loggedIn, function(req, res){
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	console.log("Currently logged in as " + res.locals.login.username);
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	res.render('loggedIn', {username: res.locals.login.username});
});

//TODO: Ensure these flash messages are getting passed in/out properly
app.get('/newmockup/registerFailure', function(req, res){
	res.render('userFailure', {messages: req.flash('message'), registerFailure: true});
});

app.get('/newmockup/loginFailure', function(req, res){
	res.render('userFailure', {messages: req.flash('message'), loginFailure: true});
});

app.post('/newmockup/logout', function(req, res){
	res.render('index');
});

module.exports = app;