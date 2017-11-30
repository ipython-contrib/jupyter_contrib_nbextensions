define(function() {
	"use strict";
	// jupyter nbextensions must export a load_ipython_extension function to
	// avoid throwing an error. Also, loading the module should do nothing
	// unless the function is called, so we wrap requiring the codemirror mode
	// in the load call.
	return {
		load_ipython_extension: function () {
			requirejs(['./skill'], function () {
				console.log('[SKILL Syntax] loaded');
			});
		}
	};
});