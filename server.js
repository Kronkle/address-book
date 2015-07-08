require('colors');
var path = require('path');
var express = require('express'),
    //exphbs = require('express-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    people = require(path.join(__dirname, 'data/people.json'));

// var config = require('./config.js'),
//     funct = require('./functions.js');

var app = express();


// Configure Express - logger, parsers, sessions, and passport
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUnitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});

/* Routes */
app.use('/mockup/', express.static(path.join(__dirname, 'mockup')));
app.use('/newmockup/', express.static(path.join(__dirname, 'newmockup')));
app.get('/api/people', function(req, res) {
    res.end(JSON.stringify(people, null, '    '));
});

/* Remember to have a redirect for both success and failure
app.post('/login', 
	passport.authenticate('local-login'),
	function(req, res) {
		res.redirect('/newmockup');
	});

app.post('/register',
	passport.authenticate('local-register'),
	function(req, res) {
		res.redirect('/newmockup');
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