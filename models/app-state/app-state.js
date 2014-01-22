steal(
'can',
function(can) {

	var appState = new can.Map({
		searchTerm: '',
		flags: []
	});

	appState.bind('searchTerm', function(ev, newVal) {
		if(newVal.length === 0) {
			can.route.removeAttr('searchTerm');
		} else {
			can.route.attr('searchTerm', newVal);
		}
	});

	appState.bind('change', function(ev, attr) {
		if(attr.indexOf('flags') >= 0) {
			if(appState.flags.length === 0) {
				can.route.removeAttr('flags');
			} else {
				can.route.attr('flags', appState.flags.join(''));
			}
		}
	});

	can.route.bind('change', function() {
		appState.attr('searchTerm', can.route.attr('searchTerm') || '');
		appState.attr('flags', can.route.attr('flags') ? can.route.attr('flags').split('') : []);
	});

	return function() {
		return appState;
	};

});