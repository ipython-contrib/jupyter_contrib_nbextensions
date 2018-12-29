define([
	'require',
	'module',
	'jquery',
	'base/js/events',
	'base/js/namespace',
	'base/js/utils',
	'notebook/js/notebook',
	'services/config',
	'codemirror/lib/codemirror',
], function(
	require,
	module,
	$,
	events,
	Jupyter,
	utils,
	notebook,
	configmod,
	cm
) {
	"use strict";

	var mod_name = module.id;
	console.log('# id  = \''+module.id+'\'');
	console.log('# uri = \''+module.uri+'\'');
	var action_name_set_marker; // set on registration
	var action_name_goto_marker; // set on registration
	var marker = {};

	// create config object to load parameters
	var base_url = utils.get_body_data('baseUrl');
	var config = new configmod.ConfigSection('notebook', {base_url: base_url});

	// define default values for config parameters
	var params = {
		edit_position_history_use_shortcuts : true,
		edit_position_history_set_marker_shortcut : 'Ctrl-Alt-s',
		edit_position_history_goto_marker_shortcut : 'Ctrl-alt-g',
		edit_position_history_marker_color : '#ff0000',
		edit_position_history_marker_icon : 'fa-ellipsis-v'
	};

	/**
	 * Update params with any specified in the server's config file
	 */
	function update_params () {
		for (var key in params) {
			if (config.data.hasOwnProperty(key)) {
				params[key] = config.data[key];
			}
		}
	}

	/**
	 * Set the edit position marker at the current cursor position
	 */
	function set_marker() {
		var cell = marker.cell = Jupyter.notebook.get_selected_cell();
		var pos = cell.code_mirror.getCursor();
		if (marker.bookmark) {
			marker.bookmark.clear();
		}
		if (marker.pos === pos) {
			 /* clear marker at current position*/
			marker.pos = null;
			marker.cell = null;
			return;
		}

		var element = $('<span/>')
			.addClass('fa ' + params.edit_position_history_marker_icon)
			.css('color', params.edit_position_history_marker_color)[0];
		marker.pos = pos;
		marker.bookmark = cell.code_mirror.setBookmark(pos, { widget: element });
		return true;
	}

	/**
	 * Return cursor to the edit position marker
	 */
	function goto_marker() {
		const cell = marker.cell;

		if (cell) {
			var cells = Jupyter.notebook.get_cells();
			for (var ii = 0; ii < cells.length; ii++) {
				if (cell === cells[ii]) {
					Jupyter.notebook.select(ii);
					Jupyter.notebook.edit_mode();
					cell.code_mirror.setCursor(marker.pos);
					break;
				}
			}
		}
		return true;
	}

	/**
	 * Register actions to collapse and uncollapse the selected heading cell
	 */
	function register_new_actions () {
		action_name_goto_marker = Jupyter.keyboard_manager.actions.register({
				handler : goto_marker,
				help : "Go back to the edit position marker",
				// icon : toggle_closed_class,
				help_index: 'goto_marker'
			},
			'goto_edit_history_marker', mod_name
		);

		action_name_set_marker = Jupyter.keyboard_manager.actions.register({
				handler : set_marker,
				help : "Set the edit position marker",
				// icon : toggle_open_class,
				help_index: 'set_marker'
			},
			'set_edit_history_marker', mod_name
		);
	}

	/**
	 * Register keyboard shortcuts according to parameters
	 */
	function register_keyboard_shortcuts() {
		if (params.edit_position_history_use_shortcuts) {
			var shrt, edt_shrts = Jupyter.keyboard_manager.edit_shortcuts;
			shrt = params.edit_position_history_set_marker_shortcut;
			if (shrt) {
				edt_shrts.add_shortcut(shrt, action_name_set_marker);
			}

			shrt = params.edit_position_history_goto_marker_shortcut;
			if (shrt) {
				edt_shrts.add_shortcut(shrt, action_name_goto_marker);
			}
		}
	}

	/**
	 * Initialization stuff that can only be done once config has loaded
	 */
	function config_loaded_callback() {
		update_params();
		register_keyboard_shortcuts();
	}

	/**
	 * Initialize the extension.
	 */
	function load_jupyter_extension () {
		//Jupyter.notebook.config.loaded.then(config_loaded_callback);
		config.loaded.then(config_loaded_callback);
		register_new_actions();
		update_params();
		register_keyboard_shortcuts();
	}

	/**
	 * Export things
	 */
	return {
		load_jupyter_extension : load_jupyter_extension,
		load_ipython_extension : load_jupyter_extension
	};
});
