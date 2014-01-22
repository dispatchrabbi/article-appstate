(function () {

    steal.config({
		map: {
			'*': {
                'jquery/jquery.js': 'jquery',
                'lodash/lodash.js': 'lodash'
			}
		},
        paths: {
            'can/': 'bower_components/can/',
            'jquery': 'bower_components/can/lib/jquery.1.9.1.js',
            'lodash': 'bower_components/lodash/dist/lodash.js'
        },
        shim: {
            jquery: {
                exports: 'jQuery'
            },
            lodash: {
				exports: '_'
			}
        },
        ext: {
            js: 'js',
            css: 'steal/less/less.js',
            less: 'steal/less/less.js',
            coffee: 'steal/coffee/coffee.js',
            ejs: 'can/view/ejs/ejs.js',
            mustache: 'can/view/mustache/mustache.js'
        }
    });

})();
