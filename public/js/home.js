var app = new Vue({

	el: '#app',

	data: {
		searchName: '',
		searchTags: [],
		champions: [],
		showModal: false,
		selectedChampion: {},
		positionRate: {},
		historyStats: {}
	},

	mounted: function () {
		// When application is ready
		this.$nextTick(function () {
			this.fetchChampions();
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
		 * Retrieves the champions list from the API
		 */
		fetchChampions: function(callback) {
			this.$http.get('/data/champions').then(function(response) {
				this.champions = response.body;
			}, function(response) {
				// error
			});
		},

		/*
		 * Retrieves the position rate of the selected champion from the API
		 */
		fetchPositions: function(callback) {
			this.$http.get('/data/champions/' + this.selectedChampion.id + '/positions').then(function(response) {
				this.positionRate = response.body;
				callback();
			}, function(response) {
				// error
			});
		},

		/*
		 * Retrieves the pick percentage over time of the selected champion from the API
		 */
		fetchHistory: function(callback) {
			this.$http.get('/data/champions/' + this.selectedChampion.id + '/history').then(function(response) {
				// Format data
				var result = {
					labels: Object.keys(response.body.total),
					values: []
				};
				Object.keys(response.body.total).forEach(function(key) {
					result.values.push(response.body.picks[key] / response.body.total[key] * 100);
				});
				this.historyStats = result;
				callback();
			}, function(response) {
				// error handling
			});
		},

		/*
		 * Returns true if the searched text is included in champion name
		 */
		matchesNameSearch: function(championName) {
			return championName.toLowerCase().includes(this.searchName.toLowerCase());
		},

		/*
		 * Returns true if the searched tags are included in champion tags
		 */
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
		 * Update the selected champion, opens the modal and load its content
		 */
		seeDetails: function(champion) {
			this.selectedChampion = champion;
			this.showModal = true;
			this.$nextTick(function () {
				this.fetchPositions(this.setUpPositionChart);
				this.fetchHistory(this.setUpPopularityChart);
			});
		},

		/*
		 * Reset the selected champion and closes the modal
		 */
		closeDetails: function() {
			this.selectedChampion = {};
			this.showModal = false;
		},

		/*
		 * Draws the chart of role percentages of the seleted champion
		 */
		setUpPositionChart: function() {
			var ctx = document.getElementById("rolesChart");
			var myChart = new Chart(ctx, {
			    type: 'bar',
			    data: {
			        labels: ["Top", "Jungle", "Mid", "Bottom"],
			        datasets: [{
			            label: 'Position occurence in percent',
			            data: [this.positionRate.top, this.positionRate.jgl, this.positionRate.mid, this.positionRate.bot],
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
		 * Draws the chart of the selected champion popularity over time
		 */
		setUpPopularityChart: function() {
			var ctx = document.getElementById('popularityChart');
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: this.historyStats.label,
					datasets: [{
						label: 'Pick percentage over time',
						data: this.historyStats.values,
						backgroundColor: "rgba(153,255,51,0.4)"
					}]
				},
			    options: {
			        responsive: false
			    }
			});
		},

		/*
		 * Generate URL to champion portrait image from champion key
		 */
		portraitUrl: function(championKey) {
			return "http://ddragon.leagueoflegends.com/cdn/7.2.1/img/champion/" + championKey + ".png";
		}
	}

});