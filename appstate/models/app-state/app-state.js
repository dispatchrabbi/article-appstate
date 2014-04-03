steal(
'can',
'can/map/setter',
function(can) {

	var AppState = can.Map.extend({
		// return an object with string friendly formats
		serialize: function(){
			return {
				searchTerm: this.attr('searchTerm'),
				flags: this.attr('flags').join(',')
			}
		},
		setFlags: function(val){
			if(val === ""){
				return [];
			}
			var arr = val;
			if(typeof val === "string"){
				arr = val.split(',')
			}
			return arr;
		}
	});

	var appState = new AppState;

    can.route("", {
		searchTerm: '',
		flags: ''
    });

    can.route.data = appState;

	return appState;

});