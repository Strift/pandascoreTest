/*
 * Modules
 */
var express	= require('express');
var fs 		= require('fs');
var path 	= require('path');

/*
 * Data
 */
const data = JSON.parse(fs.readFileSync('DATA.json'));

/*
 * Application
 */
var app = express();
app.use(express.static('public'));

// Index
app.get('/', function(req, res) {
	res.send('Hello world');
});

// Home page
app.get('/home', function(req, res) {
	res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Start server
app.listen(2020, function() {
	console.log('Application listening on port ' + 2020);
});