require('colors');
var path = require('path');
var express = require('express'),
	routes = require('./routes'),
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

app.set('view engine', 'hbs');

// Import routes here
app.use('/', routes);

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