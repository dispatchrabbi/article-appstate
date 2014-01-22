steal(
'can',
'models/app-state',
'controls/search-filter',
'controls/flag-filter',
'controls/report-list',
function(can, AppState, SearchFilter, FlagFilter, ReportList) {

	// for convenience's sake
	var reports = [
		{
			name: 'Important TPS Report 1',
			flags: ['B', 'C']
		},
		{
			name: 'Funky RFP Report 2',
			flags: ['A', 'B', 'C']
		},
		{
			name: 'Strange NSA Consultation 3',
			flags: ['A']
		},
		{
			name: 'Happy TLA Recording 4',
			flags: ['A', 'C']
		}
	];

	// prep the state from the route
	var appState = window.appState = new AppState();
	can.route.ready();

	new SearchFilter('#search-filter');
	new FlagFilter('#flag-filter');
	new ReportList('#report-list', {reports: reports});
});