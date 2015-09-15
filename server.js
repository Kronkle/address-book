require('colors');
var path = require('path'),
    express = require('express'),
	routes = require('./routes'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    initPassport = require('./passport/init'),
    LocalStrategy = require('passport-local'),
    people = require(path.join(__dirname, 'data/people.json'));

// Create Express instance
var app = express();

// HTTP request logger middleware
app.use(logger('dev'));

// Parses encoded JSON urls that are used with Passport
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Cookie parsing middleware that allows a user to pass a "secret" session string
app.use(cookieParser());

// Configure Passport sessions
app.use(session({secret: 'desktop dog', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// Store flash messages in a session if appropriate for rendering user account errors
app.use(flash());

// Initialize Passport
initPassport(passport);

// Configure MongoDB with Mongoose ODM
var dbConfig = require(path.join(__dirname, 'newmockup/db'));
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

// Configure the hbs template rendering engine
app.set('view engine', 'hbs');

// Import HTTP routes
app.use(routes);

var HTTP_PORT = 8080;

// Start server on port 8080
app.listen(HTTP_PORT, function(err) {
    if (err) {
        throw err;
    }

	console.log(('HTTP server listening on port ' + HTTP_PORT).green.bold);
	console.log(('Mockup:'.bold + ' http://localhost:' + HTTP_PORT + '/mockup/').yellow);
	console.log(('New Mockup:'.bold + ' http://localhost:' + HTTP_PORT + '/newmockup/').cyan);
	console.log(('People data:'.bold + ' http://localhost:' + HTTP_PORT + '/api/people').magenta);
});