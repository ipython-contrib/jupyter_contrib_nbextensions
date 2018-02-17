// call "jupyter nbconvert" and open generated html file in new tab

define([
    'base/js/namespace',
    'jquery',
    'base/js/events',
    'base/js/utils'
], function(
    IPython,
    $,
    events,
    utils
) {
    "use strict";

    var nbconvert_options = '--to html';
    var extension = '.html';
	var open_tab = true;

    /**
     * Get option from config
     */
    var initialize = function () {
        var config = IPython.notebook.config;
        if (config.data.hasOwnProperty('printview_nbconvert_options') ) {
            nbconvert_options = config.data.printview_nbconvert_options;
            if (nbconvert_options.search('pdf') > 0) extension = '.pdf';
            if (nbconvert_options.search('slides') > 0) extension = '.slides.html';
        }
        if (config.data.hasOwnProperty('printview_open_tab') ) {
            if (typeof(config.data.printview_open_tab) === "boolean") {
                open_tab = config.data.printview_open_tab;
            }
        }
    };

    /**
     * Call nbconvert using the current notebook server profile
     *
     */
	var callNbconvert = function () {
        events.off('notebook_saved.Notebook');
		var kernel = IPython.notebook.kernel;
		var name = IPython.notebook.notebook_name;
		var command = 'import os; os.system(\'jupyter nbconvert ' + nbconvert_options + ' \"' + name + '\"\')';
		function callback() {
			if (open_tab === true) {
				var url = utils.splitext(name)[0] + extension;
				window.open(url, '_blank');
			}
		}
		kernel.execute(command, { shell: { reply : callback } });
        $('#doPrintView').blur();
	};

    var nbconvertPrintView = function () {
        events.on('notebook_saved.Notebook',callNbconvert);
        IPython.notebook.save_notebook(false);
	};

	var load_ipython_extension = function() {
		$(IPython.toolbar.add_buttons_group([
			IPython.keyboard_manager.actions.register ({
				help   : 'Create static print view',
				icon   : 'fa-print',
				handler: nbconvertPrintView
			}, 'create-static-printview',  'printview'),
		])).find('.btn').attr('id', 'doPrintView');
        return IPython.notebook.config.loaded.then(initialize);
	};

	return {
        load_ipython_extension : load_ipython_extension
    };
});
