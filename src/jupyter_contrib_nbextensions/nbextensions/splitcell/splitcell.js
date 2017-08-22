// Allow for split cells in jupyter notebooks

define([
	'base/js/namespace',
		'base/js/events'
], function (
	Jupyter,
	events
) {
	"use strict";

	//define default config parameter values
	var params = {
		toggle_cell_style_keybinding : 'shift-s'
	};

	//updates default params with any specified in the server's config
	var update_params = function(){
		var config = Jupyter.notebook.config;
		for (var key in params){
			if (config.data.hasOwnProperty(key)){
				params[key] = config.data[key];
			}
		}
	};

	 var setup = function (){
		// update defaults
		update_params();

		//register actions with ActionHandler instance
		var prefix = 'auto';
		var name = 'toggle-cell-style';
		var action = {
			icon : 'fa-arrows-h',
			help : 'Toggle split/centered cell style',
			help_index : 'eb',
			id : 'split_cells',
			handler : toggle_cell_style
		};

		var action_full_name = Jupyter.keyboard_manager.actions.register(action, name, prefix);

		//define keyboard shortucts
		var command_mode_shortcuts = {};
		command_mode_shortcuts[params.toggle_cell_style_keybinding] =  action_full_name;

		//register keyboard shortucts with keyboard_manager
		Jupyter.notebook.keyboard_manager.command_shortcuts.add_shortcuts(command_mode_shortcuts);
		Jupyter.toolbar.add_buttons_group([action_full_name]);
	};


	var toggle_cell_style = function(){
		var cell = Jupyter.notebook.get_selected_cell();
		if (!("cell_style" in cell.metadata)){cell.metadata.cell_style = 'split';}
		else if (cell.metadata.cell_style == 'center'){cell.metadata.cell_style = 'split';}
		else {cell.metadata.cell_style = 'center';}

		update_cell_style_element(cell);
	};

	var get_cell_style_html = function(cell_style){
		console.log(cell_style);
		if (cell_style == "split") 
			{return "float:left; width:50%;";}
		return "width:100%;";
	};

	var update_cell_style_element = function(cell){
		var cell_style_html = get_cell_style_html(cell.metadata.cell_style);
		cell.element.attr('style', cell_style_html);
	};

	function initialize () {
		// On Load lets set the cell styles correctly
		var cells = Jupyter.notebook.get_cells();
		var ncells = Jupyter.notebook.ncells();

		for (var i=0; i<ncells; i++){
			var cell = cells[i];
			if ("cell_style" in cell.metadata){
				update_cell_style_element(cell, cell.metadata.cell_style);
			}
		 }
	}

	var load_extension = function() {
		Jupyter.notebook.config.loaded.then(setup);

		if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
			// notebook already loaded. Update directly
			initialize();
		}
		events.on("notebook_loaded.Notebook", initialize);
	};

	return {
		load_ipython_extension : load_extension
	};
});
