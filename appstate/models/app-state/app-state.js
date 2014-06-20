steal(
'can',
'appstate/models/reports',
'can/map/define',
function(can, Reports) {

	var AppState = can.Map.extend({
		define: {
			// A list of the reports currently being shown in the page.
			// The reports will refresh when a filter changes or search 
			// term is added.
			reports: {
				get: function(){
					return new Reports.List({
						searchTerm: this.attr('searchTerm')
					})
				},
				serialize: false
			},
			// A "virtual" property with the ids of selected reports.
			// Used to represent the reports in the serialized route.
			// Example: "4,6,23"
			reportIds: {
				serialize: function(){

				}
			},
			// A term the user is searching for
			searchTerm: {
				value: "",
				type: "string"
			}
		}
	});

	return AppState;

});