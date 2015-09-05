// add toolbar button calling File->Print Preview menu

"use strict";

define([], function () {

	var load_ipython_extension = function () {
		IPython.toolbar.add_buttons_group([
			{
				id : 'doPrintView',
				label : 'Create static print view',
				icon : 'fa-print',
				callback : function(){$('#print_preview').click();}
			}
		]);
	};

	return {
		load_ipython_extension : load_ipython_extension
	}
});
