steal(
'can',
'./models/app-state/app-state.js',
'./index.stache',
'./components/search-filter/search-filter.js',
'./components/flag-filter/flag-filter.js',
'./components/report-list/report-list.js',
function(can, AppState, appTemplate) {
	$(document).ready(function(){
		window.appState = new AppState();
		appState.bind('searchTerm', function(){
debugger;
			console.log("changed search")
		})
		can.route.map(appState);
		can.route.ready();
		$("#app").html(appTemplate(appState));
	})
});