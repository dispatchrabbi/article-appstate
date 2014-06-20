(function () {

	var fn = function(){

		return can.Model.extend({
			findAll: 'GET /flags'
		}, {});
	};

	var dependencies = ['can/model'];

	if (steal.config("fixtures")) {
		dependencies.push('./fixture.js')
	}

	dependencies.push(fn);
	steal.apply(window, dependencies);
})()