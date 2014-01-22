steal(
'can',
'./flag-filter.mustache',
function(can, template) {

	return can.Control.extend({
		defaults: {
			flags: ['A', 'B', 'C']
		}
	}, {
		init: function() {
			this.element.html(template(this.options));
		}
	});

});
