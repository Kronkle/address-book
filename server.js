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
app.use(bodyParser.urlencoded());

//TODO: why is this slowing down the app?
//app.use(cookieParser);

// Configure Passport
//TODO look at these options later
app.use(session({secret: 'myPassportKey', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize connect-flash
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
console.log("Initializing passport");
initPassport(passport);

/* Configure db */
var dbConfig = require(path.join(__dirname, 'newmockup/db'));
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

/* Routes */
app.use('/mockup/', express.static(path.join(__dirname, 'mockup')));
app.use('/newmockup/', express.static(path.join(__dirname, 'newmockup')));
app.get('/api/people', function(req, res) {
    res.end(JSON.stringify(people, null, '    '));
});

/* Remember to have a redirect for both success and failure */
app.post('/newmockup/login', passport.authenticate('login', {
	successRedirect: '/newmockup/loggedin.html',
	failureRedirect: '/newmockup',
	failureFlash: true
}));

app.post('/newmockup/register', passport.authenticate('register', {
	successRedirect: '/newmockup/registered.html',
	failureRedirect: '/newmockup',
	failureFlash: true
}));

/*app.post('/newmockup/register', 
	function(req, res) {

		console.log("registering");
		res.redirect('/newmockup/registered.html');
});
*/
/*
app.get('/newmockup/register', function(req, res){
	res.redirect('/newmockup');
	res.send('Registration done');
});
*/

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