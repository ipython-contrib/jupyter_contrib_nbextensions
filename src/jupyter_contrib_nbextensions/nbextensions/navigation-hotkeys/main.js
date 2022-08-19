// add custom shortcuts

define([
    'base/js/namespace',
    'jquery'
], function(Jupyter, $) {
    "use strict";

    // define default values for config parameters
    var params = {
	toggle_enable_edit_shortcuts  : true,
	toggle_enable_command_shortcuts  : true,
	toggle_enable_esc_shortcut  : true,
	toggle_enable_enter_shortcuts  : true,
    };

    // updates default params with any specified in the server's config
    var update_params = function() {
	var config = Jupyter.notebook.config;
	for (var key in params){
	    if (config.data.hasOwnProperty(key) ){
		params[key] = config.data[key];
	    }
	}
    };

    var add_command_shortcuts = {
	    'home' : {
		help    : 'Go to top',
		help_index : 'ga',
		handler : function() {
		    Jupyter.notebook.select(0);
		    Jupyter.notebook.scroll_to_top();
		    return false;
		}
	    },

	    'end' : {
		help    : 'Go to bottom',
		help_index : 'ga',
		handler : function() {
		    var ncells = Jupyter.notebook.ncells();
		    Jupyter.notebook.select(ncells-1);
		    Jupyter.notebook.scroll_to_bottom();
		    return false;
		}
	    },

	    'pageup' : {
		help    : 'Move cells page up',
		help_index : 'gu',
		handler : function() {
		var wh = 0.6 * $(window).height();
		var cell = Jupyter.notebook.get_selected_cell();
		var h = 0;
		/* loop until we have enough cells to span the size of the notebook window (= one page) */
		do {
		    h += cell.element.height();
		    Jupyter.notebook.select_prev();
		    cell = Jupyter.notebook.get_selected_cell();
		} while ( h < wh );
		var cp = cell.element.position();
		var sp = $('body').scrollTop();
		if ( cp.top < sp) {
		    Jupyter.notebook.scroll_to_cell(Jupyter.notebook.get_selected_index(), 0);
		}
		cell.focus_cell();
		return false;
		}
	    },

	    'pagedown' : {
		help    : 'Move cells page down',
		help_index : 'gd',
		handler : function() {

		/* jump to bottom if we are already in the last cell */
		var ncells = Jupyter.notebook.ncells();
		if ( Jupyter.notebook.get_selected_index()+1 == ncells) {
		    Jupyter.notebook.scroll_to_bottom();
		    return false;
		}

		var wh = 0.6*$(window).height();
		var cell = Jupyter.notebook.get_selected_cell();
		var h = 0;

		/* loop until we have enough cells to span the size of the notebook window (= one page) */
		do {
		    h += cell.element.height();
		    Jupyter.notebook.select_next();
		    cell = Jupyter.notebook.get_selected_cell();
		} while ( h < wh );
		cell.focus_cell();
		return false;
		}
	    }

	};

    var add_edit_shortcuts = {
	    'alt-subtract' : {
		help    : 'Merge cell with previous cell',
		help_index : 'eb',
		handler : function() {
		    var i = Jupyter.notebook.get_selected_index();
		    if (i > 0) {
			var l = Jupyter.notebook.get_cell(i-1).code_mirror.lineCount();
			Jupyter.notebook.merge_cell_above();
			Jupyter.notebook.get_selected_cell().code_mirror.setCursor(l,0);
			}
		}
	    },
	    'alt-n' : {
		help    : 'Toggle line numbers',
		help_index : 'xy',
		handler : function() {
		    var cell = Jupyter.notebook.get_selected_cell();
		    cell.toggle_line_numbers();
		    return false;
		}
	    },
	    'pagedown' : {
		help    : 'Page down',
		help_index : 'xy',
		handler : function() {

		    var ic = Jupyter.notebook.get_selected_index();
		    var cells = Jupyter.notebook.get_cells();
		    var i, h=0;
		    for (i=0; i < ic; i ++) {
			h += cells[i].element.height();
			}
		    var cur = cells[ic].code_mirror.getCursor();
		    h += cells[ic].code_mirror.defaultTextHeight() * cur.line;
		    Jupyter.notebook.element.animate({scrollTop:h}, 0);
		    return false;
		}
	    },
	    'pageup' : {
		help    : 'Page up',
		help_index : 'xy',
		handler : function() {

		    var ic = Jupyter.notebook.get_selected_index();
		    var cells = Jupyter.notebook.get_cells();
		    var i, h=0;
		    for (i=0; i < ic; i ++) {
			h += cells[i].element.height();
			}
		    var cur =cells[ic].code_mirror.getCursor();
		    h += cells[ic].code_mirror.defaultTextHeight() * cur.line;
		    Jupyter.notebook.element.animate({scrollTop:h}, 0);
		    return false;
		}
	    },
	    'ctrl-y' : {
		help : 'Toggle markdown/code',
		handler : function() {
		    var cell = Jupyter.notebook.get_selected_cell();
		    var cur = cell.code_mirror.getCursor();
		    if (cell.cell_type == 'code') {
			Jupyter.notebook.command_mode();
			Jupyter.notebook.to_markdown();
			Jupyter.notebook.edit_mode();
			cell = Jupyter.notebook.get_selected_cell();
			cell.code_mirror.setCursor(cur);
		    } else if (cell.cell_type == 'markdown') {
			Jupyter.notebook.command_mode();
			Jupyter.notebook.to_code();
			Jupyter.notebook.edit_mode();
			cell = Jupyter.notebook.get_selected_cell();
			cell.code_mirror.setCursor(cur);
		    }
		    return false;
		}
	    }
	};

    var add_edit_enter_shortcuts = {
	    'shift-enter' : {
		help    : 'Run cell and select next in edit mode',
		help_index : 'bb',
		handler : function() {
		    Jupyter.notebook.execute_cell_and_select_below();
		    var rendered = Jupyter.notebook.get_selected_cell().rendered;
		    var ccell = Jupyter.notebook.get_selected_cell().cell_type;
		    if (rendered === false || ccell === 'code') Jupyter.notebook.edit_mode();
		    return false;
		}
	    },
	    'ctrl-enter' : {
		help    : 'Run selected cell stay in edit mode',
		help_index : 'bb',
		handler : function() {
		    var cell = Jupyter.notebook.get_selected_cell();
		    var mode = cell.mode;
		    cell.execute();
		    if (mode === "edit") Jupyter.notebook.edit_mode();
		    return false;
		}
	    }
    };

    var initialize = function() {
	// Update default parameters
	update_params();

	var action;
	var prefix = 'navigation_hotkeys';
	var action_name;
	var action_name_spaces;
	var action_full_name;
	var all_commands_combined = [add_command_shortcuts, add_edit_enter_shortcuts, add_edit_shortcuts];


	// register all commands if one of the keybindings is not loaded so commands still available
	for (let i = 0; i < all_commands_combined.length; i++){
	    for (var key in all_commands_combined[i]){
		// check if the property/key is defined in the object itself, not in parent
		if (all_commands_combined[i].hasOwnProperty(key)) {
		    action = all_commands_combined[i][key];
		    action_name_spaces = all_commands_combined[i][key]['help'];
		    action_name = action_name_spaces.replace(/ /g,"-").toLowerCase();
		    action_full_name = Jupyter.keyboard_manager.actions.register(action, action_name, prefix);
		};
	    };
	};

	if (params.toggle_enable_command_shortcuts) {
	    for (var key in add_command_shortcuts) {
		// check if the property/key is defined in the object itself, not in parent
		if (add_command_shortcuts.hasOwnProperty(key)) {
		    action = add_command_shortcuts[key];
		    action_name_spaces = add_command_shortcuts[key]['help'];
		    action_name = action_name_spaces.replace(/ /g,"-").toLowerCase();
		    action_full_name = prefix + ":" + action_name;
		    Jupyter.keyboard_manager.command_shortcuts.add_shortcut(
			key, action_full_name);
		}
	    };
	    if (params.toggle_enable_esc_shortcut) {
		Jupyter.keyboard_manager.command_shortcuts.add_shortcut(
		    'Esc','jupyter-notebook:enter-edit-mode');
	    }
	};

	if (params.toggle_enable_edit_shortcuts) {
	    for (var key in add_edit_shortcuts) {
		// check if the property/key is defined in the object itself, not in parent
		if (add_edit_shortcuts.hasOwnProperty(key)) {
		    action = add_edit_shortcuts[key];
		    action_name_spaces = add_edit_shortcuts[key]['help'];
		    action_name = action_name_spaces.replace(/ /g,"-").toLowerCase();
		    action_full_name = prefix + ":" + action_name;
		    Jupyter.keyboard_manager.edit_shortcuts.add_shortcut(key, action_full_name);
		}
	    };
	    if (params.toggle_enable_enter_shortcuts) {
		for (var key in add_edit_enter_shortcuts) {
		    // check if the property/key is defined in the object itself, not in parent
		    if (add_edit_enter_shortcuts.hasOwnProperty(key)) {
			action = add_edit_enter_shortcuts[key];
			action_name_spaces = add_edit_enter_shortcuts[key]['help'];
			action_name = action_name_spaces.replace(/ /g,"-").toLowerCase();
			action_full_name = prefix + ":" + action_name;
			Jupyter.keyboard_manager.edit_shortcuts.add_shortcut(
			    key, action_full_name);
		    }
		};
	    };
	    Jupyter.keyboard_manager.edit_shortcuts.add_shortcut(
		'alt-add','jupyter-notebook:split-cell-at-cursor');
	};

    };

    var load_ipython_extension = function() {
	return Jupyter.notebook.config.loaded.then(initialize);
    };

    var extension = {
	load_ipython_extension : load_ipython_extension
    };
    return extension;
});
