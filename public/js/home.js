var app = new Vue({

	el: '#app',

	data: {
		champions: {}
	},

	// When application is ready
	mounted: function () {
		this.$nextTick(function () {
			this.fetchChampions();
		})
	},

	methods: {
		fetchChampions: function() {
			this.$http.get('/data/champions').then(function(response) {
				console.log(response);
				this.champions = response.body;
			}, function(response) {
				console.log(response);
			});
		}
	}

});