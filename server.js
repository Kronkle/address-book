require('colors');
var path = require('path');
var express = require('express');
var people = require(path.join(__dirname, 'data/people.json'));

var app = express();

/* Routes */
app.use('/mockup/', express.static(path.join(__dirname, 'mockup')));
app.use('/newmockup/', express.static(path.join(__dirname, 'newmockup')));
app.get('/api/people', function(req, res) {
    res.end(JSON.stringify(people, null, '    '));
});
/*
app.post('/login', 
	passport.authenticate('local'),
	function(req, res) {
		res.redirect('/users/' + req.user.username);
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