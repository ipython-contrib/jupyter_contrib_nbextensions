// convert current notebook to html by calling "ipython nbconvert" and open static html file in new tab

define([
    'base/js/namespace',
    'jquery',
], function(IPython, $) {
    "use strict";
    if (IPython.version[0] < 3) {
        console.log("This extension requires at least IPython 3.x")
        return
    }

    /**
     * Call nbconvert using the current notebook server profile
     *
     */
	var nbconvertPrintView = function () {
		var name = IPython.notebook.notebook_name;
		var command = 'ip=get_ipython(); import os; os.system(\"jupyter nbconvert --profile=%s --to html '
            + name + '\" % ip.profile)';
		callbacks = {
			iopub : {
				output : function() {
					var url = name.split('.ipynb')[0] + '.html';
					var win=window.open(url, '_blank');
					win.focus();
				}
			}
		};
		IPython.notebook.kernel.execute(command, callbacks);
        //$('#doPrintView').blur();
	};

	var load_ipython_extension = function () {
		IPython.toolbar.add_buttons_group([
			{
				id : 'doPrintView',
				label : 'Create static print view',
				icon : 'fa-print',
				callback : nbconvertPrintView
			}
		])
	}
	return {
		load_ipython_extension : load_ipython_extension
	}
})
