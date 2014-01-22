steal(
'can',
'./search-filter.mustache',
function(can, template) {

	return can.Control.extend({
		init: function() {
			this.element.html(template({}));
		}
	});

});