// Adds a button to hide all cells below the selected heading
define([
	'jquery',
	'require',
	'base/js/events',
	'base/js/namespace',
	'base/js/utils',
	'notebook/js/notebook',
	'notebook/js/textcell',
	'services/config'
], function(
	$,
	require,
	events,
	Jupyter,
	utils,
	notebook,
	textcell,
	configmod
) {
	"use strict";

	var mod_name = 'collapsible_headings';
	var action_name_collapse; // set on registration
	var action_name_uncollapse; // set on registration

	if (Jupyter.version[0] < 3) {
		console.log('[' + mod_name + '] This extension requires IPython/Jupyter >= 3.x');
	}

	// create config object to load parameters
	var base_url = utils.get_body_data('baseUrl');
	var config = new configmod.ConfigSection('notebook', {base_url: base_url});
	config.loaded.then(config_loaded_callback);

	// define default values for config parameters
	var params = {
		collapsible_headings_add_button : false,
		collapsible_headings_use_shortcuts : true,
		collapsible_headings_shortcut_collapse : 'left',
		collapsible_headings_shortcut_uncollapse: 'right'
	};

	// function to update params with any specified in the server's config file
	function update_params () {
		for (var key in params) {
			if (config.data.hasOwnProperty(key)) {
				params[key] = config.data[key];
			}
		}
	}

	/**
	 * Return the level of nbcell.
	 * The cell level is an integer in the range 1-7 inclusive
	 *
	 * @param {Object} cell notebook cell
	 * @return {Integer} cell level
	 */
	function get_cell_level (cell) {
		// headings can have a level up to 6, so 7 is used for a non-heading
		var level = 7;
		if ((typeof(cell) === 'object')  && (cell.cell_type === 'markdown')) {
			level = cell.get_text().match(/^#*/)[0].length || level;
		}
		return Math.min(level, 7); // we rely on 7 being max
	}

	/**
	 * Check if a cell is a heading cell.
	 *
	 * @param {Object} cell notebook cell
	 * @return {Boolean}
	 */
	function is_heading (cell) {
		return get_cell_level(cell) < 7;
	}

	/**
	 * Check if a cell is a collapsed heading cell.
	 *
	 * @param {Object} cell notebook cell
	 * @return {Boolean}
	 */
	function is_collapsed_heading (cell) {
		return (is_heading(cell) && cell.metadata.heading_collapsed === true);
	}

	/**
	 * Check if a cell is an uncollapsed heading cell.
	 *
	 * @param {Object} cell notebook cell
	 * @return {Boolean}
	 */
	function is_uncollapsed_heading (cell) {
		return (is_heading(cell) && cell.metadata.heading_collapsed !== true);
	}

	/**
	 * Uncollapse any headings which are hiding the cell at index
	 *
	 * @param {Integer} index - index of cell to reveal
	 */
	function reveal_cell_by_index (index) {
		// Restrict the search to cells that are of the same level and lower
		// than the currently selected cell by index.
		var ref_cell = Jupyter.notebook.get_cell(index);
		var pivot_level = get_cell_level(ref_cell) - 1;
		while (index > 0) {
			index--;
			var cell = Jupyter.notebook.get_cell(index);
			var cell_level = get_cell_level(cell);
			if (cell_level < pivot_level) {
				if (is_collapsed_heading(cell)) {
					toggle_heading(cell);
				}
				pivot_level = cell_level;
			}
		}
	}

	/**
	 * update a cell's styles
	 * Add or remove collapsed/uncollapsed classes to match the cell's status
	 * as a non-heading or collapsed/uncollapsed
	 */
	function update_heading_cell_styles (cell) {
		var collapsed = cell.metadata.heading_collapsed === true;
		cell.element.find('.collapsible_headings_toggle')
			.toggleClass('collapsible_headings_collapsed', collapsed)
			.find('.fa')
				.toggleClass('fa-plus-circle', collapsed)
				.toggleClass('fa-minus-circle', !collapsed);
	}

	/**
	 * Update the cell's heading toggle element
	 *
	 * @param {Object} cell notebook cell
	 */
	function update_heading_cell_toggle_control (cell) {
		var level = get_cell_level(cell);
		var show = level < 7;
		var cht = cell.element.find('.input_prompt > .collapsible_headings_toggle');
		cht.toggle(show);
		var child = cht.children();
		for (var hh = 1; hh < 7; hh++) {
			child.toggleClass('h' + hh, hh == level);
		}
	}

	/**
	 * find the closest header cell to input cell
	 */
	function find_header_cell (cell, test_func) {
		var header_cell = cell;
		for (var index = cell.element.index(); index >= 0; index--) {
			cell = Jupyter.notebook.get_cell(index);
			if (is_heading(cell)) {
				if (test_func === undefined || test_func(cell)) {
					return cell;
				}
			}
		}
		return undefined;
	}

	/**
	 * hellos
	 */
	function update_collapsed_headings (cell) {
		cell = (cell === undefined) ? undefined : find_header_cell(cell);
		var index = 0;
		var section_level = 0;
		var show = true;
		if (cell !== undefined) {
			index = cell.element.index() + 1;
			section_level = get_cell_level(cell);
			show = cell.metadata.heading_collapsed !== true;
		}
		var hide_above = 7;
		for (var ncells = Jupyter.notebook.ncells(); index < ncells; index++) {
			cell = Jupyter.notebook.get_cell(index);
			var level = get_cell_level(cell);
			if (level <= section_level) {
				break;
			}
			if (show) {
				if (level <= hide_above) {
					cell.element.slideDown('fast');
					hide_above = is_collapsed_heading(cell) ? level : 7;
				}
				else {
					cell.element.slideUp('fast');
				}
			}
			else {
				cell.element.slideUp('fast');
			}
		}
	}

	/**
	 * Hide/reveal all cells in the section headed by cell.
	 *
	 * @param {Cell} cell notebook cell
	 */
	function toggle_heading (cell, set_collapsed) {
		if (is_heading(cell)) {
			set_collapsed = set_collapsed !== undefined ? set_collapsed : cell.metadata.heading_collapsed !== true;
			if (set_collapsed) {
				cell.metadata.heading_collapsed = true;
			}
			else {
				delete cell.metadata.heading_collapsed;
			}
			console.log('['+ mod_name + '] ' + (set_collapsed ? 'collapsed' : 'expanded') +' cell ' + cell.element.index());
			update_collapsed_headings(cell);
			update_heading_cell_styles(cell);
		}
	}

	/**
	 *
	 */
	function register_new_cell (cell) {
		var ip = cell.element.find('.input_prompt');
		ip.on('click', function () { toggle_heading(cell);});

		$('<div/>')
			.addClass('collapsible_headings_toggle')
			.addClass('btn btn-default')
			.append('<div><i class="fa fa-fw"></i></div>')
			.appendTo(ip);
		update_heading_cell_styles(cell);
		update_heading_cell_toggle_control(cell);
	}

	/**
	 * patch the Notebook class methods select, undelete and delete_cells
	 */
	function patch_Notebook () {
		var orig_notebook_select = notebook.Notebook.prototype.select;
		notebook.Notebook.prototype.select = function (index, moveanchor) {
			reveal_cell_by_index(index);
			return orig_notebook_select.apply(this, arguments);
		};

		var orig_notebook_undelete = notebook.Notebook.prototype.undelete;
		notebook.Notebook.prototype.undelete = function () {
			var ret = orig_notebook_undelete.apply(this, arguments);
			update_collapsed_headings();
			return ret;
		};

		var orig_notebook_delete_cells = notebook.Notebook.prototype.delete_cells;
		notebook.Notebook.prototype.delete_cells = function () {
			var ret = orig_notebook_delete_cells.apply(this, arguments);
			update_collapsed_headings();
			return ret;
		};
	}

	/**
	 * patch TextCell.prototype.execute to rethink collapsed headings
	 */
	function patch_TextCell () {
		var orig_textcell_execute = textcell.TextCell.prototype.execute;
		textcell.TextCell.prototype.execute = function () {
			var ret = orig_textcell_execute.apply(this, arguments);
			update_heading_cell_styles(this);
			update_heading_cell_toggle_control(this);
			update_collapsed_headings();
			return ret;
		};
	}

	/**
	 *
	 */
	function patch_actions () {
		var kbm = Jupyter.keyboard_manager;

		var action_up = kbm.actions.get(kbm.command_shortcuts.get_shortcut('up'));
		var orig_up_handler = action_up.handler;
		action_up.handler = function (env) {
			for (var index = env.notebook.get_selected_index() - 1; (index !== null) && (index >= 0); index--) {
				if (env.notebook.get_cell(index).element.is(':visible')) {
					env.notebook.select(index);
					env.notebook.focus_cell();
					return;
				}
			}
			return orig_up_handler.apply(this, arguments);
		};

		var action_down = kbm.actions.get(kbm.command_shortcuts.get_shortcut('down'));
		var orig_down_handler = action_down.handler;
		action_down.handler = function (env) {
			var ncells = env.notebook.ncells();
			for (var index = env.notebook.get_selected_index() + 1; (index !== null) && (index < ncells); index++) {
				if (env.notebook.get_cell(index).element.is(':visible')) {
					env.notebook.select(index);
					env.notebook.focus_cell();
					return;
				}
			}
			return orig_down_handler.apply(this, arguments);
		};
	}

	/**
	 * register actions to collapse and uncollapse the selected heading cell
	 */
	function register_new_actions () {
		action_name_collapse = Jupyter.keyboard_manager.actions.register({
				handler : function (env) {
					toggle_heading(env.notebook.get_selected_cell(), true);
				},
				help : "Collapse a heading cell's section",
				icon : 'fa-caret-right',
				help_index: 'c1'
			},
			'collapse_heading', mod_name
		);

		action_name_uncollapse = Jupyter.keyboard_manager.actions.register({
				handler : function (env) {
					toggle_heading(env.notebook.get_selected_cell(), false);
				},
				help : "Un-collapse (expand) a heading cell's section",
				icon : 'fa-caret-down',
				help_index: 'c2'
			},
			'uncollapse_heading', mod_name
		);
	}


	function config_loaded_callback () {
		update_params();

		// (Maybe) add a button to the toolbar
		if (params.collapsible_headings_add_button) {
			Jupyter.toolbar.add_buttons_group([{
				label: 'toggle heading',
				icon: 'fa-angle-double-up',
				callback: function () {
					/**
					 * If the currently selected cell is a heading cell,
					 * collapse it. Otherwise, collapse the closest uncollapsed
					 * heading above the currently selected cell above the
					 * currently selected cell.
					 */
					var heading_cell = find_header_cell(Jupyter.notebook.get_selected_cell(), function (cell) {
						return cell.element.is(':visible') && (cell.metadata.heading_collapsed !== true);
					});
					if (is_heading(heading_cell)) {
						toggle_heading(heading_cell, true);
						Jupyter.notebook.select(heading_cell.element.index());
					}
				}
			}]);
		}

		// (Maybe) register keyboard shortcuts
		if (params.collapsible_headings_use_shortcuts) {
			var shrt, cmd_shrts = Jupyter.keyboard_manager.command_shortcuts;

			shrt = params.collapsible_headings_shortcut_collapse;
			if (shrt) {
				cmd_shrts.add_shortcut(shrt, action_name_collapse);
			}

			shrt = params.collapsible_headings_shortcut_uncollapse;
			if (shrt) {
				cmd_shrts.add_shortcut(shrt, action_name_uncollapse);
			}
		}
	}

	/**
	 * Initialize the extension.
	 */
	function load_jupyter_extension () {
		// Load css first
		$('<link/>')
			.attr({
				id: 'collapsible_headings_css',
				rel: 'stylesheet',
				type: 'text/css',
				href: require.toUrl('./main.css')
			})
			.appendTo('head');

		// apply patches.
		patch_actions();
		patch_Notebook();
		patch_TextCell();

		// bind to the create.Cell event to ensure that any newly-created cells are registered
		events.on('create.Cell', function (evt, data) {
			reveal_cell_by_index(data.index);
			register_new_cell(data.cell);
		});

		// register existing cells
		Jupyter.notebook.get_cells().forEach(register_new_cell);

		// register new actions
		register_new_actions();

		// update collapsed/uncollapsed status
		update_collapsed_headings();

		// load config to get all of the config.loaded.then stuff done
		config.load();
	}

	/**
	 * Export things
	 */
	return {
		get_cell_level : get_cell_level,
		reveal_cell_by_index : reveal_cell_by_index,
		update_collapsed_headings : update_collapsed_headings,
		load_jupyter_extension : load_jupyter_extension,
		load_ipython_extension : load_jupyter_extension
	};
});
