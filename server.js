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

//TODO: Display flash messages in generic, precompiled handlebars template for login/registration failures
app.use(flash());

// Initialize Passport
initPassport(passport);

/* Configure db */
var dbConfig = require(path.join(__dirname, 'newmockup/db'));
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

app.set('view engine', 'hbs');

// Import routes here
app.use(routes);

var HTTP_PORT = 8080;

app.listen(HTTP_PORT, function(err) {
    if (err) {
        throw err;
    }

	console.log(('HTTP server listening on port ' + HTTP_PORT).green.bold);
	console.log(('Mockup:'.bold + ' http://localhost:' + HTTP_PORT + '/mockup/').yellow);
	console.log(('New Mockup:'.bold + ' http://localhost:' + HTTP_PORT + '/newmockup/').cyan);
	console.log(('People data:'.bold + ' http://localhost:' + HTTP_PORT + '/api/people').magenta);
});