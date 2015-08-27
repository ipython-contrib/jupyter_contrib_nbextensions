define([], function () {

	var clean_restart = function(){
		IPython.notebook.clear_all_output();
		IPython.notebook.kernel.restart();
	}

	var confirm_dialog = function(){
		var dialog = $('<div/>');
		dialog.html('This will clear all output and restart the kernel, do you want to continue?');
		dialog.dialog({
			resizable: false,
			modal: true,
			title: 'Clear All',
			buttons: {
				"Reset All": function() {
					clean_restart();
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	};

	var load_ipython_extension = function () {
		IPython.toolbar.add_buttons_group([{
			label:'clear all, and restart',
			icon:'fa-chevron-circle-down',
			callback:confirm_dialog,
		}])
		console.log('loading clear and restart extension ok');
	}
	return {
		load_ipython_extension : load_ipython_extension
	}
});
