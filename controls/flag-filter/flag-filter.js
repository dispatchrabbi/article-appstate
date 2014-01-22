steal(
'can',
'./flag-filter.mustache',
'models/app-state',
function(can, template, AppState) {

	return can.Control.extend({
		defaults: {
			appState: AppState,
			flags: ['A', 'B', 'C']
		}
	}, {
		init: function() {
			var appState = this.options.appState;

			this.element.html(template(this.options, {
				flagChecked: function(options) {
					var flagToCheck = this.toString(); // because this has to be an object, which is weird.
					return appState.attr('flags').indexOf(flagToCheck) >= 0 ? options.fn(this) : '';
				}
			}));
		},

		'input[type=checkbox] change': function(el, ev) {
			var flag = el.data('flag'),
				checked = el[0].checked,
				index = this.options.appState.flags.indexOf(flag);

			if(checked && index < 0) {
				// we need to add the flag to appState
				this.options.appState.flags.push(flag);
			} else if(index >= 0 && !checked) {
				this.options.appState.flags.splice(index, 1);
			}
		}
	});

});
