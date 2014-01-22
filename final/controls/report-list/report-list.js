steal(
'lodash',
'can',
'./report-list.mustache',
'../../models/app-state/app-state.js',
function(_, can, template, AppState) {

	return can.Control.extend({
		defaults: {
			appState: AppState,
			reports: []
		}
	}, {
		init: function() {
			this.viewModel = new can.Map({
				reports: this.filterReports(this.options.reports)
			});

			this.element.html(template(this.viewModel, {
				formatFlags: function() {
					return this.flags.join('');
				}
			}));
		},

		'{appState} change': function() {
			this.viewModel.reports.replace(this.filterReports(this.options.reports));
		},

		filterReports: function(reportsList) {
			var appState = this.options.appState,
				appFlags = appState.attr('flags').attr();

			return _.filter(reportsList, function(report) {
				return (
					(report.name.toLowerCase().indexOf(appState.searchTerm.toLowerCase()) >= 0) &&
					(appFlags.length === 0 || _.intersection(appFlags, report.flags).length === appFlags.length)
				);
			});
		}
	});

});