// convert current notebook to html by calling "ipython nbconvert" and open static html file in new tab

define([
    'base/js/namespace',
    'jquery',
], function(IPython, $) {
    "use strict";
    if (IPython.version[0] != 3) {
        console.log("This extension requires IPython 3.x")
        return
    }
    
    /**
     * Call nbconvert using the current notebook server profile
     *
     */
	var nbconvertPrintView = function () {
		var kernel = IPython.notebook.kernel;
		var path = IPython.notebook.notebook_path;
		var command = 'ip=get_ipython(); import os; os.system(\"ipython nbconvert --profile=%s --to html '
            + path + '\" % ip.profile)';
		function callback(out_type, out_data) {
			var url = '/files/' + path.split('.ipynb')[0] + '.html';
			var win=window.open(url, '_blank');
			win.focus();
		}
		kernel.execute(command, { shell: { reply : callback } });
	};

	IPython.toolbar.add_buttons_group([
		{
		id : 'doPrintView',
		label : 'Create static print view',
		icon : 'fa-print',
		callback : nbconvertPrintView
		}
	])
})
