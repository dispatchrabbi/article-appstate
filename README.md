Using Application State
===

So you have the perfect design. You’ve broken it down into beautiful, modular components, each contained in its own element, blissfully unaware of any other part of the page. Now comes the dreaded job of making them talk to each other.

There are pitfalls everywhere in this task. Hook every component to every other component it talks to and you lose the modularity you so painstakingly constructed. Pass all the data to every object and you end up with a thousand parameters - or worse, a [god object](http://sourcemaking.com/antipatterns/the-blob). Approach each control differently, and your code ends up strewn over the entire project, unfollowable.

What you need is **application state**.

Application state is the collection of all of the properties that define, well, what state your application is in. It’s the smallest amount of adhesive you need to put your disparate controls together (and some controls might not even need to know about it). Ideally, your application should be able to recreate any past configuration with only a copy of the application state from that time — and this is the secret superpower of the application state.

> It’s worth taking an aside to note that an unchecked application state object can easily turn into a miscellaneous bucket, being used to store things simply because more than one control wants access to them. It’s tempting to put shared models or random pieces of data you might want to hang on to for later onto the application state because it’s such a convenient place to put them. Reject the temptation! This is how your elegant application state turns into the dreaded god object, your controls will then be even more intractable than before.

With our restraint summoned, let’s go to [the example](./1-first-pass/index.html).

This application collects TPS reports from… well, we don’t actually care where they come from, but someone writes them, and here they are. TPS reports need to be searchable by name and filterable by the very helpful flags *A*, *B*, and *C*, and we have a search box and three helpful checkboxes that make that happen.

> If you want to dig deeper, you can look at all the code for this example in [the github repository](https://github.com/dispatchrabbi/article-appstate).

We need to create an object that facilitates communication between these three components, and the first step is to figure out what information needs to be shared. In this case, it’s pretty simple: the report list needs to know what criteria to filter by, and that information is supplied by the search box and the flag filters. In your application, you may find that what information needs to be shared will change over the course of the project. Remember, always try to keep your application state tracking the minimum amount of information it needs to.

Another important aspect of the application state is that it should always look the same to the whole application. Because of this, we’re going to make the application state a singleton. If you need to save the application state for some reason, it’s easy enough to serialize it.

Here's [our application state object](./2-with-app-state/models/app-state/app-state.js):

```js
steal('can', function(can) {

var appState = new can.Map({
	searchTerm: '',
	flags: []
});

return appState;

});
```

When we go to modify the controls to listen to the application state, a hidden benefit of making it a singleton emerges: we don’t have to worry about passing it into every control. We can instantiate it and know that it is the same state that every other control is working with.

We’ll hook up [the search control](./2-with-app-state/controls/search-filter/search-filter.js) to modify the application state on change:

```js
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

	// A more responsive way to do this would be to listen to keyup
	// and throttle the method that changes the application state
	// but for this example we'll keep it simple.
	'#search change': function(el, ev) {
		this.options.appState.attr('searchTerm', el.val());
	}
});
```

The [flag filters](./2-with-app-state/controls/flag-filter/flag-filter.js) can be similarly modified.

And we’ll make the [report list](./2-with-app-state/controls/report-list/report-list.js) listen to changes in the application state:

```js
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

	// filter reports when the application state changes
	'{appState} change': function() {
		this.viewModel.reports.replace(this.filterReports(this.options.reports));
	},

	filterReports: function(reportsList) {
		var appState = this.options.appState,
			appFlags = appState.attr('flags').attr();

		return _.filter(reportsList, function(report) {
			// we want reports whose name contains the search string and that have all of the checked flags
			return (
				(report.name.toLowerCase().indexOf(appState.searchTerm.toLowerCase()) >= 0) &&
				(appFlags.length === 0 || _.intersection(appFlags, report.flags).length === appFlags.length)
			);
		});
	}
});
```

Okay, with the idea and implementation of application state under our belts, let’s see how to unleash the application state’s superpower: making state easily available to the user so they can return to a specific state. You might implement save and restore functionality by any number of mechanisms — more on that later — but we’re going to take the easy way out and put the state right in the URL.

CanJS has a routing system called [can.route](http://canjs.com/docs/can.route.html). It lets you manipulate the URL fragment using a special can.Map. Because both can.route and the application state are Maps, we can hook them up in such a way that they reflect each other. [Let’s give it a try.](./3-with-routing/models/app-state/app-state.js)

```js
// Change the route when the app state changes.
appState.bind('change', function(ev) {
	var currentState = appState.attr();
	can.route.attr({
		searchTerm: currentState.searchTerm,
		flags: currentState.flags.join('')
	}, true);
});

// Change the app state when the route changes.
can.route.bind('change', function() {
	appState.attr('searchTerm', can.route.attr('searchTerm') || '');
	appState.attr('flags', can.route.attr('flags') ? can.route.attr('flags').split('') : []);
});
```

Now, when you modify the application state, the URL will change, and vice versa. That means that you can change the filter settings and bookmark the URL, and when you come back, the application will load into the same state you left it in.

This is very cool, but it’s time to take it to the next level. Let’s add a feature that makes web developers everywhere tremble: an *undo* button. I bet you we can do it in 15 lines of code (not counting boilerplate). Let’s rock.

First, we create [the control for the undo button](./4-final/controls/undo-button/undo-button.js) (and [its associated template](./4-final/controls/undo-button/undo-button.mustache)). Here’s the part that saves and restores each state:

```js
// save the state when it changes
'{appState} change': function() {
	if(! _.isEqual(this.options.states[this.options.states.length - 1], this.options.appState.attr())) {
		this.options.states.push(this.options.appState.attr());
	}
},
// restore the state when the button is pressed
'button click': function() {
	this.options.states.pop(); // get rid of the state we're undoing

	if(this.options.states.length) {
		// This is the coolest bit! All we have to do is replace the application state,
		// and every other control takes care of itself, no matter how complex your state or application is.
		this.options.appState.attr(this.options.states[this.options.states.length - 1], true);
	}
}
```

Now all we have left to do is instantiate the control in [our main JS file](./4-final/index.js) and we have infinite undo in 12 lines of code! Eat your heart out, St. Louis.

This pattern lets you hook together all the components of your web application in a simple and maintainable way and it guarantees a single place to keep important shared information. We’ve seen how that guarantee makes it dead simple to implement simple save and restore functionality on top of. And it’s easy to extend the concept and apply it to groups of controls everywhere (as long as you’re keeping your application state lean). For these reasons, the application state (or [observer pattern](http://sourcemaking.com/design_patterns/observer)) is a tool you’ll want to keep handy in your architecture toolbox.

