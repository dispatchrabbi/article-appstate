(function () {

	var fn = function(){

		return can.Model.extend({
			findAll: 'GET /reports'
		}, {});
	};

	var dependencies = ['can/model'];

	if (steal.config("fixtures")) {
		dependencies.push('./fixture.js')
	}

	dependencies.push(fn);
	debugger;
	steal.apply(window, dependencies);
})()