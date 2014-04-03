A better architecture for JavaScript apps
===

One of the biggest challenges in a complex application is getting all the different parts of the app to talk to each other simply, cleanly, and reliably. The application state pattern is an architectural pattern that enables exactly this while keeping coupling to a minimum.

In this article, I’ll go over what application state entails and why you’d want to use it, demonstrate adding application state to a simple application, and show off some cool tricks you can add to your app that you get for free when you follow this pattern.

Why use application state?
---
Imagine you’re building [this simple TPS report viewer](http://dispatchrabbi.github.io/article-appstate/1-first-pass/index.html):
<img src="http://dispatchrabbi.github.io/article-appstate/images/app.png">

It displays TPS reports from… well, we don’t actually care where they’re from, but someone writes them, and here they are. TPS reports need to be searchable by name and filterable by the flags *A*, *B*, and *C*, so I’ve divided the application into a search bar component, a flag filter component, and a report list.
<img src="http://dispatchrabbi.github.io/article-appstate/images/app-components.png">

In order for the report list to filter based on the search bar and the flag checkboxes, it has to know when they change. A first attempt at this might be to have the search bar and flag checkboxes update the report list whenever they change values:
<img src="http://dispatchrabbi.github.io/article-appstate/images/app-components-arrows.png">

This would work okay for something this simple, but as soon as you add another component — say, an undo button — you have to add communication to every other component:
<img src="http://dispatchrabbi.github.io/article-appstate/images/app-undo-components.png">

For every component you add to your application, you have to add communication to every component you already have, and it can get ugly fast. (This is known as the [handshake problem](http://en.wikipedia.org/wiki/Handshake_problem).) There’s got to be a better way — and there is: **application state**.

What is application state?
---
Application state is the collection of all of the properties that define, well, what state your application is in. It’s the smallest amount of adhesive you need to put your disparate controls together (and some controls might not even need to know about it). Ideally, your application should be able to recreate any past configuration with only a copy of the application state from that time — and this is the secret superpower of the application state.

Let’s look at how we can apply this idea to the application above.

Adding application state to your app
---
We need to create an object that facilitates communication between these three components, and the first step is to figure out what information needs to be shared. In this case, it’s pretty simple: the report list needs to know what criteria to filter by, and that information is supplied by the search box and the flag filters.
<img src="http://dispatchrabbi.github.io/article-appstate/images/app-state-arrows.png">

Here's [our application state object](http://github.com/dispatchrabbi/article-appstate/2-with-app-state/models/app-state/app-state.js):

```js
steal('can', function(can) {

var appState = new can.Map({
	searchTerm: '',
	flags: []
});

return appState;

});
```

You’ll note that the application state is a singleton. This is because the application state should always look the same to the whole application. If you need to clone the application state for some reason (for example, to save it for later), it’s easy enough to serialize it.

When we go to modify the controls to listen to the application state, a hidden benefit of making it a singleton emerges: we don’t have to worry about passing the state into every control. Instead, we can just require the module and know that it is the same state that every other control is working with.

We’ll hook up [the search control](http://github.com/dispatchrabbi/article-appstate/2-with-app-state/controls/search-filter/search-filter.js) to modify the application state on change:

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

The [flag filters](http://github.com/dispatchrabbi/article-appstate/2-with-app-state/controls/flag-filter/flag-filter.js) can be similarly modified. After that, we’ll make the [report list](http://github.com/dispatchrabbi/article-appstate/2-with-app-state/controls/report-list/report-list.js) listen to changes in the application state:

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

Making state available
---
Okay, with the idea and implementation of application state under our belts, let’s see how to unleash the application state’s superpower: making state easily available to the user so they can return to a specific state. You might implement save and restore functionality by any number of mechanisms — more on that later — but we’re going to take the easy way out and put the state right in the URL.

CanJS has a routing system called [can.route](http://canjs.com/docs/can.route.html). It lets you manipulate the URL fragment using a special can.Map. Because both can.route and the application state are Maps, we can hook them up in such a way that they reflect each other. [Let’s give it a try.](http://github.com/dispatchrabbi/article-appstate/3-with-routing/models/app-state/app-state.js)

```js
var AppState = can.Map.extend({
	// return an object with string friendly formats
	serialize: function(){
		return {
			searchTerm: this.attr('searchTerm'),
			flags: this.attr('flags').join(',')
		}
	},
	setFlags: function(val){
		if(val === ""){
			return [];
		}
		var arr = val;
		if(typeof val === "string"){
			arr = val.split(',')
		}
		return arr;
	}
});

var appState = new AppState;

can.route("", {
	searchTerm: '',
	flags: ''
});

can.route.data = appState;
```

Now, when you modify the application state, the URL will change, and vice versa. That means that you can change the filter settings and bookmark the URL, and when you come back, the application will load into the same state you left it in.

Doing something new
This is very cool, but it’s time to take it to the next level. Let’s add a feature that makes web developers everywhere tremble: an *undo* button. I bet you we can do it in 15 lines of code (not counting boilerplate). Let’s rock.

First, we create [the control for the undo button](http://github.com/dispatchrabbi/article-appstate/4-final/controls/undo-button/undo-button.js) (and [its associated template](http://github.com/dispatchrabbi/article-appstate/4-final/controls/undo-button/undo-button.mustache)). Here’s the part that saves and restores each state:

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

Now all we have left to do is instantiate the control in [our main JS file](http://github.com/dispatchrabbi/article-appstate/4-final/index.js) and we have infinite undo in 12 lines of code! [Eat your heart out, St. Louis.](http://dispatchrabbi.github.io/article-appstate/4-final/index.html)

A note of caution
---
Here’s the final architecture for the TPS report viewer:
<img src="http://dispatchrabbi.github.io/article-appstate/images/app-state-undo-arrows.png">

Because the application state connects most of the components in an application, it can be tempting to turn it into a miscellaneous bucket and using it to store things simply because more than one control wants access to them. The most common culprits here are shared data models or random pieces of data you want to store for later.

Fight this temptation! This is how your elegant application state turns into [the blob](http://sourcemaking.com/antipatterns/the-blob), and how your architecture becomes just as intractable and tightly-coupled as if you weren’t using application state at all. Instead, keep your application state lean by only storing the minimum amount of information you need to recreate the state of the application.

Putting it together
---
This pattern lets you hook together all the components of your web application in a simple and maintainable way and it guarantees a single place to keep important shared information. We’ve seen how save-and-restore functionality essentially falls right out of that guarantee. And it’s easy to extend the concept and apply it to groups of controls everywhere (as long as you’re keeping your application state lean). For these reasons, the application state is a tool you’ll want to keep handy in your architecture toolbox.

Looking for more?
You can find all the code for the examples used in this article in [the github repository](https://github.com/dispatchrabbi/article-appstate), and then check out [the observer pattern](http://sourcemaking.com/design_patterns/observe), which is the pattern the application state architecture follows. Also, Justin Meyer has [a couple](http://www.youtube.com/watch?v=NZi5Ru4KVug) [of videos](http://www.youtube.com/watch?v=yFxDY5SQQp4) on the topic that come at the same architecture from a different angle. If you want to solidify what you learned in this article, check them out.