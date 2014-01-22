steal(
'can',
'./models/app-state/app-state.js',
'./controls/search-filter/search-filter.js',
'./controls/flag-filter/flag-filter.js',
'./controls/report-list/report-list.js',
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

	can.route.ready();

	new SearchFilter('#search-filter');
	new FlagFilter('#flag-filter');

	new ReportList('#report-list', {reports: reports});
});