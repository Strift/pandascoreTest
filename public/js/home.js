var app = new Vue({

	el: '#app',

	data: {
		searchName: '',
		searchTags: [],
		champions: []
	},

	mounted: function () {
		// When application is ready
		this.$nextTick(function () {
			this.fetchChampions();
		})
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
		fetchChampions: function() {
			this.$http.get('/data/champions').then(function(response) {
				this.champions = response.body;
			}, function(response) {
				// error
			});
		},

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

		portraitUrl: function(key) {
			return "http://ddragon.leagueoflegends.com/cdn/7.2.1/img/champion/" + key + ".png";
		}
	}

});