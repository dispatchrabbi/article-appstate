steal(
'can',
function(can) {

	var appState = new can.Map({
		searchTerm: '',
		flags: []
	});

	appState.bind('change', function(ev) {
		var currentState = appState.attr();
		can.route.attr({
			searchTerm: currentState.searchTerm,
			flags: currentState.flags.join('')
		}, true);
	});

	can.route.bind('change', function() {
		appState.attr('searchTerm', can.route.attr('searchTerm') || '');
		appState.attr('flags', can.route.attr('flags') ? can.route.attr('flags').split('') : []);
	});

	return appState;

});