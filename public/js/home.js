var app = new Vue({

	el: '#app',

	data: {
		search: '',
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

		matchesSearch: function(name) {
			return name.toLowerCase().includes(this.search.toLowerCase());
		}
	}

});