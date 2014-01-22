steal(
'can',
'models/app-state',
'controls/search-filter',
'controls/flag-filter',
'controls/undo-button',
'controls/report-list',
function(can, AppState, SearchFilter, FlagFilter, UndoButton, ReportList) {

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
	new UndoButton('#undo-button');

	new ReportList('#report-list', {reports: reports});
});