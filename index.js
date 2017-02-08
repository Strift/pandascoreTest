/*
 * Modules
 */
var express	= require('express');
var fs 		= require('fs');
var path 	= require('path');

/*
 * Configuration
 */
const port = 2020;

/*
 * Data
 */
const data = JSON.parse(fs.readFileSync('DATA.json'));

/*
 * Application
 */
var app = express();

// Index
app.get('/', function(req, res) {
	res.send('Hello world');
});

// Home page
app.get('/home', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/home.html'));
});

// Start server
app.listen(port, function() {
	console.log('App listening on port ' + port);
});