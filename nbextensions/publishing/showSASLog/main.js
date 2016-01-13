
define([
    'base/js/namespace',
    'jquery',
    'services/config',
    'base/js/events',
    'base/js/utils'
], function(IPython, $, configmod, events, utils) {
    "use strict";

    //var nbconvert_options = '--to html';
    var extension = '.html';
	var open_tab = true;
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});
    //console.log(config, base_url);
    
    
    /**
     * Call nbconvert using the current notebook server profile
     *
     */
	var callNbconvert = function () {
        events.off('notebook_saved.Notebook');
		var kernel = IPython.notebook.kernel;
		var name = IPython.notebook.notebook_name;
		//var command = 'import os; os.system(\"jupyter nbconvert ' + nbconvert_options + ' ' + name + '\")';
                //var command = 'color_log=highlight(log,SASLogLexer(), HtmlFormatter(full=True, style=SASLogStyle)); open(\'/python3/notebooks/jadean/saslog4.html\',\'wt\').write(showLog.data)';
                var command ='showSASLog_11092015';

                console.log(command);
		function callback() {
			if (open_tab === true) {
				var url = name.split('.ipynb')[0] + extension;
				var logWindow = window.open('showSASLog.html', '_blank');
                                /*jQuery.get('/python3/notebooks/jadean/saslog10.html', function(data) {
                                    logWindow.document.write(data);
                                });*/
			}
		}
		kernel.execute(command, { shell: { reply : callback } });
        $('#showSASLog').blur()
	};

    var SASlog = function () {
        events.on('notebook_saved.Notebook',callNbconvert);
        IPython.notebook.save_notebook(false);
	};

	var load_ipython_extension = function() {
        config.load();
		IPython.toolbar.add_buttons_group([
			{
				id: 'showSASLog',
				label: 'Show the SAS Log for last executed cell',
				icon: 'fa-wrench',
				callback: SASlog
			}
		]);
	};
	return {
        load_ipython_extension : load_ipython_extension
    };
});
