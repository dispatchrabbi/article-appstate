steal(
'can',
'appstate/models/reports',
'appstate/models/flags',
'can/map/define',
function(can, Reports, Flags) {

	var AppState = can.Map.extend({
		define: {
			// A list of the reports currently being shown in the page.
			// The reports will refresh when a filter changes or search 
			// term is added.
			reports: {
				get: function(){
					return new Reports.List({
						searchTerm: this.attr('searchTerm'),
						flags: this.define.selectedFlags.serialize.apply(this)
					})
				},
				serialize: false
			},
			flags: {
				value: new Flags.List({}),
				serialize: false
			},
			// A virtual property showing the flags the user has selected
			// Used to represent the reports in the serialized route.
			// Example: "A,B"
			selectedFlags: {
				serialize: function(){
					var selected = this.attr('flags').filter(function(flag){
						return flag.attr('selected');
					});
					var ids = _.pluck(selected, 'name');
					return ids.join(',')
				},
				set: function(val){
	                var arr = val.split(',');
	                // for each id, toggle any matched flag
	                this.attr('flags').each(function(flag){
	                    if(arr.indexOf(flag.attr('name')) !== -1){
	                        flag.attr('selected', true);
	                    } else {
	                        flag.attr('selected', false)
	                    }
	                })
            	}
			},
			// A term the user is searching for
			searchTerm: {
				value: ""
			}
		}
	});

	return AppState;

});