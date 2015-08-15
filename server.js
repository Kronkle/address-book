/* Test user:
Kronk
kronk
mkronk7@gmail.com
*/

require('colors');
var path = require('path');
var express = require('express'),
    session = require('express-session'),
    passport = require('passport'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser');
    bodyParser = require('body-parser');
    LocalStrategy = require('passport-local'),
    people = require(path.join(__dirname, 'data/people.json'));

var app = express();
app.use(logger('dev'));

//TODO: These were needed to call passport.authenticate properly. Research why:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

//TODO: Read documentation for this
app.use(cookieParser());

// Configure Passport
app.use(session({secret: 'desktop dog', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize connect-flash
var flash = require('connect-flash');

//TODO: Display flash messages in generic, precompiled handlebars template for login/registration failures
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
console.log("Initializing passport");
initPassport(passport);

/* Configure db */
var dbConfig = require(path.join(__dirname, 'newmockup/db'));
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

/* Configure contact list modules */
var addContact = require(path.join(__dirname,'newmockup/addContact'));
var deleteContact = require(path.join(__dirname,'newmockup/deleteContact'));

app.set('view engine', 'hbs');

/* Routes */
app.use('/mockup/', express.static(path.join(__dirname, 'mockup')));
app.use('/newmockup/', express.static(path.join(__dirname, 'newmockup')));
app.get('/api/people', function(req, res) {
    res.end(JSON.stringify(people, null, '    '));
});

function loggedIn(req, res, next) {
    if (req.user) {
    	res.locals.login = req.user;
        next();
    } else {
        next();
    }
}

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

/* TODO: Add favorite to contact list. Is this the best way to do this? */
app.post('/newmockup/addContact', function(req, res){
	console.log("Current user is " + req.user.username);
	console.log("Contact to be added is " + req.body.name);
	addContact(function() {
		console.log("Contact added: " + req.body.name);
		res.end("Contact added");
	}, req.user.username, req.body.name);		
});

/* TODO: Remove favorite from contact list */
app.post('/newmockup/deleteContact', function(req,res){
	console.log("Contact deleted: " + req.body.name);
	res.end("Contact deleted");
});

/* TODO: Display contact list when chosen in preferences menu */
app.post('/newmockup/contactList', function(req, res){
	console.log("Contact list chosen");
});

app.get('/newmockup/loggedIn', loggedIn, function(req, res){
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	console.log(res.locals.login);
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	res.render('loggedIn', {username: req.flash('username')});
});

//TODO: Ensure these flash messages are getting passed in/out properly, research default view directory expectations
app.get('/newmockup/registerFailure', function(req, res){
	res.render('registerFailure', {messages: req.flash('message')});
});

app.get('/newmockup/loginFailure', function(req, res){
	res.render('loginFailure', {messages: req.flash('message')});
});

app.post('/newmockup/logout', function(req, res){
	res.render('index');
});

var HTTP_PORT = 8080;

app.listen(HTTP_PORT, function(err) {
    if (err) {
        throw err;
    }

	console.log(('HTTP server listening on port ' + HTTP_PORT).green);

	console.log('Mockup:'.bold + ' http://localhost:' + HTTP_PORT + '/mockup/');
	console.log('New Mockup:'.bold + ' http://localhost:' + HTTP_PORT + '/newmockup/');
	console.log('People data:'.bold + ' http://localhost:' + HTTP_PORT + '/api/people');
});