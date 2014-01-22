steal(
'lodash',
'can',
'./report-list.mustache',
function(_, can, template) {

	return can.Control.extend({
		defaults: {
			reports: []
		}
	}, {
		init: function() {
			this.viewModel = new can.Map({
				reports: this.options.reports
			});

			this.element.html(template(this.viewModel, {
				formatFlags: function() {
					return this.flags.join('');
				}
			}));
		}
	});

});