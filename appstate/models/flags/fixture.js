steal('can/util/fixture', function(){
	// for convenience's sake
	var flags = [
		{
			name: 'A'
		},
		{
			name: 'B'
		},
		{
			name: 'C'
		}
	];
	
	can.fixture('GET /flags', function(req){
		return flags;
	})
})