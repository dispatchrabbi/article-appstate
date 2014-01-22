steal(
'can',
'./undo-button.mustache',
'models/app-state',
function(can, template, AppState) {

	return can.Control.extend({
		defaults: {
			appState: AppState,
			states: [] // the last element in this is always the current state
		}
	}, {
		init: function() {
			this.element.html(template({}));
			this.options.states.push(this.options.appState.attr());
		},
		'{appState} change': function() {
			if(! _.isEqual(this.options.states[this.options.states.length - 1], this.options.appState.attr())) {
				this.options.states.push(this.options.appState.attr());
			}
		},
		'button click': function() {
			this.options.states.pop();

			if(this.options.states.length) {
				this.options.appState.attr(this.options.states[this.options.states.length - 1], true);
			}
		}
	});

});