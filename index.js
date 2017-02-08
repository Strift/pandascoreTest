var express = require('express');
var app = express();

const port = 2020;

app.get('/', function(req, res) {
	res.send('Hello world');
});

app.listen(port, function() {
	console.log('App listening on port ' + port);
});