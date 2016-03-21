define([
	'base/js/namespace',
	'base/js/events',
	'notebook/js/codecell',
	'jquery'
], function (
	Jupyter,
	events,
	codecell,
	$
){
	'use strict';
	
	var CodeCell = codecell.CodeCell;
	
	function patch_CodeCell_execute () {
		console.log('[Freeze] patching CodeCell.prototype.execute')	
		var old_execute = CodeCell.prototype.execute;
		
		CodeCell.prototype.execute = function () {
			if (this.metadata.run_control === undefined ||
				!this.metadata.run_control.frozen
			) {
				old_execute.apply(this, arguments);
			}
		}
	}
	
	function set_state(cell, state) { 
		if (cell instanceof CodeCell) {
			if (cell.metadata.run_control === undefined)
				cell.metadata.run_control = {};
			if (state === undefined)
				state = 'normal';			
			switch(state) {
				case 'normal':
					var new_run_control_values = {
						read_only : false,
						frozen : false
					};
					var bg = "";
					break;
				case 'read_only':
					var new_run_control_values = {
							read_only : true,
							frozen : false
					};
					var bg = "#FFFEF0";
					break;
				case 'frozen':
					var new_run_control_values = {
						read_only : true,
						frozen : true
					};
					var bg = "#f0feff";
					break;
			}
			$.extend(cell.metadata.run_control, new_run_control_values);
			cell.code_mirror.setOption('readOnly', cell.metadata.run_control.read_only);
			var prompt = cell.element.find('div.input_area');
			prompt.css("background-color", bg);
		}
	}

	function set_state_selected (state) {
		var cells = Jupyter.notebook.get_selected_cells();
		for (var i = 0; i < cells.length; i++) {
			set_state(cells[i], state)
		}
	}
	
	function make_normal_selected () {
		set_state_selected('normal');
	}

	function make_read_only_selected () {
		set_state_selected('read_only');
	}
	
	function make_frozen_selected () {
		set_state_selected('frozen');
	}
	
	
	function initialize_states () {
		var cells = Jupyter.notebook.get_cells();
		for (var i in cells) {
			var cell = cells[i];
			if (cell instanceof CodeCell) {
				if (cell.metadata.run_control != undefined) {
					if (cell.metadata.run_control.read_only) {
						if (cell.metadata.run_control.frozen) {
							set_state(cell, 'frozen')
						} else {
							set_state(cell, 'read_only')
						}
					} else {
						set_state(cell, 'normal')
					}
				} else {
					set_state(cell, 'normal');
				}
			}
		}
	}
	
	function load_extension () {
		Jupyter.toolbar.add_buttons_group([
			{
				id : 'make_normal',
				label : 'lift restrictions from selected cells',
				icon : 'fa-unlock-alt',
				callback : make_normal_selected
			},
			{
				id : 'make_read_only',
				label : 'make selected cells read-only',
				icon: 'fa-lock',
				callback : make_read_only_selected
			},
			{
				id : 'freeze_cells',
				label : 'freeze selected cells',
				icon : 'fa-asterisk',
				callback : make_frozen_selected
			}
		]);
		
		if (typeof Jupyter.notebook === "undefined") {
			events.on("notebook_loaded.Notebook", initialize_states)
		} else {
			initialize_states();
		}
		
		patch_CodeCell_execute();
	}
	
	return {
		load_jupyter_extension : load_extension,
		load_ipython_extension : load_extension
	}
});
