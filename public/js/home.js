var app = new Vue({

	el: '#app',

	data: {
		searchName: '',
		searchTags: [],
		champions: [],
		matches: [],
		showModal: false,
		selectedChampion: {}
	},

	mounted: function () {
		// When application is ready
		this.$nextTick(function () {
			this.fetchChampions();
			this.fetchMatches();
		});
	},

	computed: {
		sortedChampionList: function() {
			return this.champions.sort(function(champA, champB) {
				if (champA.name < champB.name)
					return -1;
				if (champA.name > champB.name)
					return 1;
				return 0;
			});
		}
	},

	methods: {
		/*
		 * API requests
		 */

		fetchChampions: function() {
			this.$http.get('/data/champions').then(function(response) {
				this.champions = response.body;
			}, function(response) {
				// error
			});
		},

		fetchMatches: function() {
			this.$http.get('/data/matches').then(function(response) {
				this.matches = response.body;
			}, function(response) {
				// error
			});
		},

		/*
		 * Search
		 */

		matchesNameSearch: function(name) {
			return name.toLowerCase().includes(this.searchName.toLowerCase());
		},

		matchesTagSearch: function(championTags) {
			var match = true;
			this.searchTags.forEach(function(tag) {
				if (championTags.includes(tag) == false) {
					match = false;
				}
			});
			return match;
		},

		/*
		 * Modal
		 */

		seeDetails: function(champion) {
			this.selectedChampion = champion;
			this.showModal = true;
			this.$nextTick(function () {
				this.setUpChart(this.getPositionPercentage(champion));
			});
		},

		closeDetails: function() {
			this.selectedChampion = {};
			this.showModal = false;
		},

		getPositionPercentage: function(champion) {
			var total = 0;
			var percentages = { top: 0, jgl: 0, mid: 0, bot: 0 };
			this.matches.forEach(function(match) {
				if (match.champion == champion.id) {
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
		},

		setUpChart: function(positionPercentage) {
			var ctx = document.getElementById("rolesChart");
			var myChart = new Chart(ctx, {
			    type: 'bar',
			    data: {
			        labels: ["Top", "Jungle", "Mid", "Bottom"],
			        datasets: [{
			            label: 'Position occurence in percent',
			            data: [positionPercentage.top, positionPercentage.jgl, positionPercentage.mid, positionPercentage.bot],
			            backgroundColor: [
			                'rgba(255, 99, 132, 0.2)',
			                'rgba(54, 162, 235, 0.2)',
			                'rgba(75, 192, 192, 0.2)',
			                'rgba(153, 102, 255, 0.2)'
			            ],
			            borderColor: [
			                'rgba(255,99,132,1)',
			                'rgba(54, 162, 235, 1)',
			                'rgba(75, 192, 192, 1)',
			                'rgba(153, 102, 255, 1)'
			            ],
			            borderWidth: 1
			        }]
			    },
			    options: {
			        responsive: false,
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        }
			    }
			});
		},

		/*
		 * Misc
		 */

		portraitUrl: function(key) {
			return "http://ddragon.leagueoflegends.com/cdn/7.2.1/img/champion/" + key + ".png";
		}
	}

});