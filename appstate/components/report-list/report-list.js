steal(
'lodash',
'can',
'./report-list.stache',
function(_, can, template) {

	can.Component.extend({
		tag: 'report-list',
		template: template
	})
	
});