steal(
'can',
function(can) {

	var appState = new can.Map({
		searchTerm: '',
		flags: []
	});

	return appState;

});