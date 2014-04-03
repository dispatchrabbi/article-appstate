steal(
'can',
'./search-filter.mustache',
'../../models/app-state/app-state.js',
function(can, template, AppState) {

	return can.Control.extend({
		defaults: {
			appState: AppState
		}
	}, {
		init: function() {
			this.element.html(template({
				appState: this.options.appState
			}));
		},

		'#search change': function(el, ev) {
			this.options.appState.attr('searchTerm', el.val());
		}
	});

});