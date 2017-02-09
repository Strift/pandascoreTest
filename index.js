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
 * Features
 */

function getMatchesSortedByDate() {
	return data.matches.sort(function(matchA, matchB) {
		if (matchA.timestamp < matchB.timestamp)
			return 1;
		if (matchA.timestamp > matchB.timestamp)
			return -1;
		return 0;
	});
}

function getChampionPositionRate(id) {
	var total = 0;
	var percentages = { top: 0, jgl: 0, mid: 0, bot: 0 };
	data.matches.forEach(function(match) {
		if (match.champion == id) {
			total++;
			if (match.lane == "TOP")
				percentages.top++;
			else if (match.lane == "JUNGLE")
				percentages.jgl++;
			else if (match.lane == "MIDDLE" || match.lane == "MID")
				percentages.mid++;
			else {
				percentages.bot++;
			}
		}
	});
	percentages.top = Math.round(percentages.top * 100 / total);
	percentages.jgl = Math.round(percentages.jgl * 100 / total);
	percentages.mid = Math.round(percentages.mid * 100 / total);
	percentages.bot = Math.round(percentages.bot * 100 / total);
	return percentages;
}

function getChampionPickRate(id) {
	var total = {}; // Total matches per month
	var picks = {}; // Champion picks per month
	var matches = getMatchesSortedByDate();
	// Count picks and total matches
	for (var i = matches.length - 1; i >= 0; i--) {
		// Key 
		var date = new Date(matches[i].timestamp * 1000);
		var splittedDate = date.toDateString().split(" ");
		var key = splittedDate[1] + "-" + splittedDate[3];
		// If there is no value for this month, initialize at 0
		if (!(key in total)) {
			total[key] = 0;
			picks[key] = 0;
		}
		// Increment total games for this month
		total[key]++;
		// Increment picks for this month
		if (matches[i].champion == id) {
			picks[key]++;
		}
	}
	return {total, picks};
}

/*
 * Routes
 */

var app = express();
app.use(express.static('public'));

/* Web routes */

app.get('/', function(req, res) {
	res.send('Hello world');
});

app.get('/home', function(req, res) {
	res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

/* Api routes */

app.get('/data/champions', function(req, res) {
	res.json(data.champions);
});

app.get('/data/champions/:id/positions', function(req, res) {
	res.json(getChampionPositionRate(req.params.id));
});

app.get('/data/champions/:id/history', function(req, res) {
	res.json(getChampionPickRate(req.params.id));
});

app.get('/data/matches', function(req, res) {
	res.json(data.matches);
});

// Start server
app.listen(2020, function() {
	console.log('Application listening on port ' + 2020);
});