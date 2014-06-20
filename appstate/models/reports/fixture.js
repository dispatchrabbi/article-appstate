steal('can/util/fixture', function(){
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
	
	can.fixture('GET /reports', function(req){
		return _.filter(reports, function(report){
			return report.name.indexOf(req.data.searchTerm) === 0;
		})
	})
})