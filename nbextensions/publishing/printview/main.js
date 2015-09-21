// call "jupyter nbconvert" and open generated html file in new tab

define([
    'base/js/namespace',
    'jquery',
    'services/config',
    'base/js/utils'
], function(IPython, $, configmod, utils) {
    "use strict";

    var nbconvert_options = '--to html';
	var open_tab = true;
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    /**
     * Get option from config
     */
    config.loaded.then(function() {
        console.log("config")
        if (config.data.hasOwnProperty('printpreview_nbconvert_options') ) {
            nbconvert_options = config.data.printpreview_nbconvert_options;
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
	var nbconvertPrintView = function () {
		var kernel = IPython.notebook.kernel;
		var name = IPython.notebook.notebook_name;
		var command = 'import os; os.system(\"jupyter nbconvert ' + nbconvert_options + ' ' + name + '\")';
		function callback(out_type, out_data) {
			if (open_tab === true) {
				var url = name.split('.ipynb')[0] + '.html';
				var win = window.open(url, '_blank');
			}
		}
        console.log("cmd:", command)
		kernel.execute(command, { shell: { reply : callback } });
        $('#doPrintView').blur()
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
