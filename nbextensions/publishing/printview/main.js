// call "jupyter nbconvert" and open generated html file in new tab

define([
    'base/js/namespace',
    'jquery',
    'services/config',
    'base/js/events',
    'base/js/utils'
], function(IPython, $, configmod, events, utils) {
    "use strict";

    var nbconvert_options = '--to html';
    var extension = '.html';
	var open_tab = true;
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    /**
     * Get option from config
     */
    config.loaded.then(function() {
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
    });

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
        config.load();
		IPython.toolbar.add_buttons_group([
			{
				id: 'doPrintView',
				label: 'Create static print view',
				icon: 'fa-print',
				callback: nbconvertPrintView
			}
		]);
	};

	return {
        load_ipython_extension : load_ipython_extension
    };
});
