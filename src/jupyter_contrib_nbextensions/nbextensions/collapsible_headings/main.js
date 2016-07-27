// Adds a button to hide all cells below the selected heading
define([
	'jquery',
	'require',
	'base/js/events',
	'base/js/namespace',
	'base/js/utils',
	'notebook/js/notebook',
	'notebook/js/textcell',
	'notebook/js/tooltip',
	'services/config'
], function(
	$,
	require,
	events,
	Jupyter,
	utils,
	notebook,
	textcell,
	tooltip,
	configmod
) {
	"use strict";

	var mod_name = 'collapsible_headings';
	var action_names = { // set on registration
		insert_above: '',
		insert_below: '',
		collapse: '',
		uncollapse: '',
		select: ''
	};
	var toggle_closed_class; // set on config load
	var toggle_open_class; // set on config load
	var select_reveals = true; // used as a flag to prevent selecting a heading section from also opening it

	if (Jupyter.version[0] < 3) {
		console.log('[' + mod_name + '] This extension requires IPython/Jupyter >= 3.x');
	}

	// create config object to load parameters
	var base_url = utils.get_body_data('baseUrl');
	var config = new configmod.ConfigSection('notebook', {base_url: base_url});
	config.loaded.then(config_loaded_callback);

	// define default values for config parameters
	var params = {
		add_button : false,
		add_insert_header_buttons: false,
		use_toggle_controls : true,
		make_toggle_controls_buttons : false,
		size_toggle_controls_by_level : true,
		toggle_open_icon : 'fa-caret-down',
		toggle_closed_icon : 'fa-caret-right',
		toggle_color : '#aaaaaa',
		use_shortcuts : true,
		shortcuts: {
			collapse: 'left',
			uncollapse: 'right',
			select: 'shift-right',
			insert_above: 'shift-a',
			insert_below: 'shift-b',
		},
		show_section_brackets : false,
		section_bracket_width : 10,
		show_ellipsis : true,
		select_reveals : true
	};

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
		var pivot_level = get_cell_level(ref_cell);
		var cells = Jupyter.notebook.get_cells();
		while (index > 0 && pivot_level > 1) {
			index--;
			var cell = cells[index];
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
	 * Add or remove collapsed/uncollapsed classes & metadata to match the
	 * cell's status as a non-heading or collapsed/uncollapsed heading
	 */
	function update_heading_cell_status (cell) {
		var level = get_cell_level(cell);
		var cell_is_heading = level < 7;
		var cht = cell.element.find('.input_prompt > .collapsible_headings_toggle');
		if (cell_is_heading) {
			var collapsed = cell.metadata.heading_collapsed === true;
			cell.element.toggleClass('collapsible_headings_collapsed', collapsed);
			cell.element.toggleClass('collapsible_headings_ellipsis', params.show_ellipsis);
			if (params.use_toggle_controls) {
				if (cht.length < 1) {
					cht = $('<div/>')
						.addClass('collapsible_headings_toggle')
						.css('color', params.toggle_color)
						.append('<div><i class="fa fa-fw"></i></div>')
						.appendTo(cell.element.find('.input_prompt'));
					var clickable = cht.find('i');
					if (params.make_toggle_controls_buttons) {
						cht.addClass('btn btn-default');
						clickable = cht;
					}
					clickable.on('click', function () { toggle_heading(cell); });
				}
				// Update the cell's toggle control classes
				var hwrap = cht.children();
				hwrap.find('.fa')
					.toggleClass(toggle_closed_class, collapsed)
					.toggleClass(toggle_open_class, !collapsed);
				if (params.size_toggle_controls_by_level) {
					for (var hh = 1; hh < 7; hh++) {
						hwrap.toggleClass('h' + hh, hh == level);
					}
				}
			}
		}
		else {
			delete cell.metadata.heading_collapsed;
			cell.element.removeClass('collapsible_headings_collapsed');
			cht.remove();
		}
	}

	/**
	 * find the closest header cell to input cell
	 */
	function find_header_cell (cell, test_func) {
		for (var index = Jupyter.notebook.find_cell_index(cell); index >= 0; index--) {
			cell = Jupyter.notebook.get_cell(index);
			if (is_heading(cell) && (test_func === undefined || test_func(cell))) {
				return cell;
			}
		}
		return undefined;
	}

	function select_heading_section(head_cell, extend) {
		var head_lvl = get_cell_level(head_cell);
		var ncells = Jupyter.notebook.ncells();
		var head_ind = Jupyter.notebook.find_cell_index(head_cell);
		var tail_ind;
		for (tail_ind = head_ind; tail_ind + 1 < ncells; tail_ind++) {
			if (get_cell_level(Jupyter.notebook.get_cell(tail_ind + 1)) <= head_lvl) {
				break;
			}
		}
		select_reveals = params.select_reveals;
		if (extend) {
			var ank_ind = Jupyter.notebook.get_anchor_index();
			if (ank_ind <= head_ind) {
				// keep current anchor, extend to head
				Jupyter.notebook.select(tail_ind, false);
				select_reveals = true;
				return;
			}
			else if (ank_ind >= tail_ind) {
				// keep current anchor, extend to tail
				Jupyter.notebook.select(head_ind, false);
				select_reveals = true;
				return;
			}
			// head_ind < ank_ind < tail_ind i.e. anchor is inside section
		}
		// move_anchor to header cell
		Jupyter.notebook.select(head_ind, true);
		// don't move anchor, i.e. extend, to tail cell
		Jupyter.notebook.select(tail_ind, false);
		select_reveals = true;
	}

	function get_jquery_bracket_section (head_cell) {
		var head_lvl = get_cell_level(head_cell);
		var cells = Jupyter.notebook.get_cells();
		var cell_elements = $();
		for (var ii = 0; ii < cells.length; ii++) {
			var cell = cells[ii];
			if (cell_elements.length > 0) {
				if (get_cell_level(cell) <= head_lvl) {
					break;
				}
				cell_elements = cell_elements.add(cell.element);
			}
			else if (cell === head_cell) {
				cell_elements = cell_elements.add(cell.element);
			}
		}
		return cell_elements;
	}

	/**
	 * Callback function attached to the bracket-containing div, should toggle
	 * the relevant heading
	 */
	var bracket_callback_timeout_id;
	var bracket_clicks = 0;
	function bracket_callback (evt) {
		// prevent bubbling, otherwise when closing a section, the cell gets
		// selected & re-revealed after being hidden
		evt.preventDefault();
		evt.stopPropagation();
		// evt.target is what was clicked, not what the handler was attached to
		var bracket = $(evt.target);
		var bracket_level = Number(bracket.attr('data-bracket-level'));
		if (bracket_level) {
			var bracket_cell = bracket.closest('.cell').data('cell');
			var header_cell = find_header_cell(bracket_cell, function (cell) {
				return get_cell_level(cell) == bracket_level;
			});
			switch (evt.type) {
				case 'dblclick':
					clearTimeout(bracket_callback_timeout_id);
					bracket_callback_timeout_id = undefined;
					toggle_heading(header_cell);
					break;
				case 'click':
					if (bracket_callback_timeout_id === undefined) {
						bracket_callback_timeout_id = setTimeout(function () {
							select_heading_section(header_cell, evt.shiftKey);
							bracket_callback_timeout_id = undefined;
						}, 300);
					}
					break;
				case 'mouseenter':
				case 'mouseleave':
					var in_section = get_jquery_bracket_section(header_cell)
						.find('.chb div[data-bracket-level=' + bracket_level + ']');
					$('.chb div').not(in_section).removeClass('chb-hover');
					in_section.toggleClass('chb-hover', evt.type === 'mouseenter');
					break;
			}
			bracket_clicks = 0;
		}
		return false;
	}

	/**
	 * Update the hidden/collapsed status of all the cells under
	 * - the notebook, if param cell === undefined
	 * - the heading which contains the specified cell (if cell !== undefined,
	 *   but is also not a heading)
	 * - the specified heading cell (if specified cell is a heading)
	 */
	function update_collapsed_headings (cell) {
		var index = 0;
		var section_level = 0;
		var show = true;
		if (cell !== undefined && (cell = find_header_cell(cell)) !== undefined) {
			index = Jupyter.notebook.find_cell_index(cell) + 1;
			section_level = get_cell_level(cell);
			show = cell.metadata.heading_collapsed !== true;
		}
		var hide_above = 7;
		var brackets_open = {};
		var max_open = 0; // count max number open at one time to calc padding
		for (var ncells = Jupyter.notebook.ncells(); index < ncells; index++) {
			cell = Jupyter.notebook.get_cell(index);
			var level = get_cell_level(cell);
			if (level <= section_level) {
				break;
			}
			if (show && level <= hide_above) {
				cell.element.slideDown('fast');
				hide_above = is_collapsed_heading(cell) ? level : 7;
				delete cell.metadata.hidden;
			}
			else {
				cell.element.slideUp('fast');
				cell.metadata.hidden = true;
				continue;
			}

			if (params.show_section_brackets) {
				var chb = cell.element.find('.chb').empty();
				if (chb.length < 1) {
					chb = $('<div/>')
						.addClass('chb')
						.on('click dblclick', bracket_callback)
						.appendTo(cell.element);
				}
				var num_open = 0; // count number of brackets currently open
				for (var jj = 1; jj < 7; jj++) {
					if (brackets_open[jj] && level <= jj) {
						brackets_open[jj].addClass('chb-end'); // closing, add class
						delete brackets_open[jj]; // closed
					}
					var opening = level == jj;
					if (brackets_open[jj] || opening) {
						num_open++;
						brackets_open[jj] = $('<div/>')
							.on('mouseenter mouseleave', bracket_callback)
							.attr('data-bracket-level', jj)
							.appendTo(chb); // add bracket element
						if (opening) { // opening, add class
							brackets_open[jj].addClass('chb-start');
						}
					}
				}
				max_open = Math.max(num_open, max_open);
			}
		}
		if (params.show_section_brackets) {
			// close any remaining
			for (var ii in brackets_open) {
				brackets_open[ii].addClass('chb-end');
			}
			// adjust padding to fit in brackets
			var bwidth = params.section_bracket_width;
			var dwidth = max_open * (2 + bwidth);
			$('#notebook-container').css('padding-right', (16 + dwidth) + 'px');
			$('.chb')
				.css('right', '-' + (3 + dwidth) + 'px')
				.find('div')
					.css('width', bwidth);
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
			console.log('[' + mod_name + '] ' + (set_collapsed ? 'collapsed' : 'expanded') +' cell ' + Jupyter.notebook.find_cell_index(cell));
			update_collapsed_headings(params.show_section_brackets ? undefined : cell);
			update_heading_cell_status(cell);
		}
	}

	/**
	 * patch the Notebook class methods select, undelete
	 */
	function patch_Notebook () {
		// we have to patch select, since the select.Cell event is only fired
		// by cell click events, not by the notebook select method
		var orig_notebook_select = notebook.Notebook.prototype.select;
		notebook.Notebook.prototype.select = function (index, moveanchor) {
			if (select_reveals) {
				reveal_cell_by_index(index);
			}
			return orig_notebook_select.apply(this, arguments);
		};

		// we have to patch undelete, as there is no event to bind to. We
		// could bind to create.Cell, but that'd be a bit OTT
		var orig_notebook_undelete = notebook.Notebook.prototype.undelete;
		notebook.Notebook.prototype.undelete = function () {
			var ret = orig_notebook_undelete.apply(this, arguments);
			update_collapsed_headings();
			return ret;
		};
	}

	/**
	 * patch the Tooltip class to make sure tooltip still ends up in the
	 * correct place. We temporarily override the cell's position:relative rule
	 * while the tooltip position is calculated & the animation queued, before
	 * removing the override again
	 */
	function patch_Tooltip () {
		var orig_tooltip__show = tooltip.Tooltip.prototype._show;
		tooltip.Tooltip.prototype._show = function (reply) {
			var $cell = $(this.code_mirror.getWrapperElement()).closest('.cell');
			$cell.css('position', 'static');
			var ret = orig_tooltip__show.apply(this, arguments);
			$cell.css('position', '');
			return ret;
		};
	}

	/**
	 * patch the up/down arrow actions to skip selecting cells which are hidden
	 * by a collapsed heading
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
		action_names.collapse = Jupyter.keyboard_manager.actions.register({
				handler : function (env) {
					var cell = env.notebook.get_selected_cell();
					if (is_heading(cell)) {
						toggle_heading(cell, true);
					}
					else {
						cell = find_header_cell(cell);
						if (cell !== undefined) {
							Jupyter.notebook.select(Jupyter.notebook.find_cell_index(cell));
							cell.focus_cell();
						}
					}
				},
				help : "Collapse the selected heading cell's section",
				icon : toggle_closed_class,
				help_index: 'c1'
			},
			'collapse_heading', mod_name
		);

		action_names.uncollapse = Jupyter.keyboard_manager.actions.register({
				handler : function (env) {
					var cell = env.notebook.get_selected_cell();
					if (is_heading(cell)) {
						toggle_heading(cell, false);
					}
					else {
						var ncells = Jupyter.notebook.ncells();
						for (var ii = Jupyter.notebook.find_cell_index(cell); ii < ncells; ii++) {
							cell = Jupyter.notebook.get_cell(ii);
							if (is_heading(cell)) {
								Jupyter.notebook.select(ii);
								cell.focus_cell();
								break;
							}
						}
					}
				},
				help : "Un-collapse (expand) the selected heading cell's section",
				icon : toggle_open_class,
				help_index: 'c2'
			},
			'uncollapse_heading', mod_name
		);

		action_names.select = Jupyter.keyboard_manager.actions.register({
				handler : function (env) {
					var cell = env.notebook.get_selected_cell();
					if (is_heading(cell)) {
						select_heading_section(cell, true);
					}
				},
				help : "Select all cells in the selected heading cell's section",
				help_index: 'c3'
			},
			'select_heading_section', mod_name
		);

		action_names.insert_above = Jupyter.keyboard_manager.actions.register({
				handler : function (env) { insert_heading_cell(true); },
				help : "Insert a heading cell above the selected cell",
				help_index: 'c4',
				icon: 'fa-caret-up'
			},
			'insert_heading_above', mod_name
		);

		action_names.insert_below = Jupyter.keyboard_manager.actions.register({
				handler : function (env) { insert_heading_cell(false); },
				help : "Insert a heading cell below the selected cell's section",
				help_index: 'c5',
				icon: 'fa-caret-down'
			},
			'insert_heading_below', mod_name
		);
	}

	function imitate_hash_click ($element) {
		var site = $('#site');
		var adjust = $element.offset().top - site.offset().top;
		site.animate({scrollTop: site.scrollTop() + adjust});
	}

	function insert_heading_cell (above) {
		var selected_cell = Jupyter.notebook.get_selected_cell();
		var ref_cell = find_header_cell(selected_cell) || selected_cell;
		var level = get_cell_level(ref_cell);
		level = (level == 7) ? 1 : level; // default to biggest level (1)
		if (above) {
			// if above, insert just above selected cell, but keep ref_cell's level
			ref_cell = selected_cell;
		}
		var index = ref_cell.element.index();
		if (!above) {
			// below requires special handling, as we really want to put it
			// below the currently selected heading's *content*
			var cells = Jupyter.notebook.get_cells();
			for (index=index + 1; index < cells.length; index++) {
				if (get_cell_level(cells[index]) <= level) {
					break;
				}
			}
			// if we make it here, index will be == cells.length, which is ok
			// as it gets the new cell inserted at the bottom of the notebook
		}
		// we don't want our newly-inserted cell to trigger opening of headings
		var cached_select_reveals = select_reveals;
		select_reveals = false;
		var new_cell = Jupyter.notebook.insert_cell_above('markdown', index);
		var new_text = 'New heading';
		new_cell.set_text(new_text);
		new_cell.set_heading_level(level);
		new_cell.code_mirror.setSelection({line:0, ch: level + 1}, {line:0, ch: level + 1 + new_text.length});
		Jupyter.notebook.select(index, true);
		// restore cached setting
		select_reveals = cached_select_reveals;
		Jupyter.notebook.focus_cell();
		Jupyter.notebook.edit_mode();
	}

	function toc2_callback (evt) {
		// evt.target is what was clicked, not what the handler was attached to
		var toc_link = $(evt.target).closest('a');
		var href = toc_link.attr('href');
		href = href.slice(href.indexOf('#') + 1); // remove #
		// for toc2's cell-toc links, we use the data-toc-modified-id attr
		var toc_mod_href = toc_link.attr('data-toc-modified-id');

		// jquery doesn't cope with $(href) or $('a[href=' + href + ']')
		// if href contains periods or other unusual characters
		var $anchor = $(document.getElementById(toc_mod_href));
		if ($anchor.length < 1) {
			// we didn't find the toc-modified id, so use the regular id
			$anchor = $(document.getElementById(href));
		}
		if ($anchor.length < 1) {
			return;
		}
		var cell_index = $anchor.closest('.cell').index();

		reveal_cell_by_index(cell_index);
		// scroll link into view once animation is complete
		setTimeout(function () { imitate_hash_click($anchor); }, 400);
	}

	function notebook_load_callback () {
		Jupyter.notebook.get_cells().forEach(update_heading_cell_status);
		update_collapsed_headings();
	}

	function config_loaded_callback () {
		$.extend(true, params, config.data.collapsible_headings);

		// set css classes
		toggle_open_class = params.toggle_open_icon || '';
		toggle_closed_class = params.toggle_closed_icon || '';

		// (Maybe) add buttons to the toolbar
		if (params.add_button) {
			Jupyter.toolbar.add_buttons_group([{
				label: 'toggle heading',
				icon: 'fa-angle-double-up',
				callback: function () {
					/**
					 * Collapse the closest uncollapsed heading above the
					 * currently selected cell.
					 */
					var heading_cell = find_header_cell(Jupyter.notebook.get_selected_cell(), function (cell) {
						return cell.element.is(':visible') && (cell.metadata.heading_collapsed !== true);
					});
					if (is_heading(heading_cell)) {
						toggle_heading(heading_cell, true);
						Jupyter.notebook.select(Jupyter.notebook.find_cell_index(heading_cell));
					}
				}
			}]);
		}
		if (params.add_insert_header_buttons) {
			Jupyter.toolbar.add_buttons_group([
				action_names.insert_above, action_names.insert_below
			],'insert_heading_cell_btns');
		}
		// add hashes
		$('#insert_heading_cell_btns .btn').prepend('# ');

		// (Maybe) register keyboard shortcuts
		if (params.use_shortcuts) {
			var cmd_shrts = Jupyter.keyboard_manager.command_shortcuts;
			for (var act in action_names) {
				if (action_names.hasOwnProperty(act) && params.shortcuts[act]) {
					cmd_shrts.add_shortcut(params.shortcuts[act], action_names[act]);
				}
			}
		}

		// Callbacks bound to the create.Cell event can execute before the cell
		// data has been loaded from JSON.
		// So, we rely on rendered.MarkdownCell event to catch headings from
		// JSON, and the only reason we use create.Cell is to update brackets
		events.on('create.Cell', function (evt, data) {
			if (params.show_section_brackets) {
				update_collapsed_headings();
			}
		});

		events.on('delete.Cell', function (evt, data) {
			update_collapsed_headings();
		});

		events.on('rendered.MarkdownCell', function (evt, data) {
			update_heading_cell_status(data.cell);
			update_collapsed_headings(params.show_section_brackets ? undefined : data.cell);
		});

		// execute now, but also bind to the notebook_loaded.Notebook event,
		// which may or may not have already occured.
		notebook_load_callback();
		events.on('notebook_loaded.Notebook', notebook_load_callback);
	}

	/**
	 * create a menu list item with a link that calls the specified action name
	 */
	function make_action_menu_item (action_name, menu_item_html) {
		var act = Jupyter.menubar.actions.get(action_name);
		var menu_item = $('<li/>');
		$('<a/>')
			.html(menu_item_html)
			.attr({'title' : act.help, 'href' : '#'})
			.on('click', function (evt) {
				Jupyter.menubar.actions.call(action_name, evt);
			})
			.appendTo(menu_item);
		return menu_item;
	}

	/**
	 * Add any new items to the notebook menu
	 */
	function insert_menu_items () {
		$('#insert_menu')
			.append('<li class="divider"/>')
			.append(make_action_menu_item(action_names.insert_above, 'Insert Heading Above'))
			.append(make_action_menu_item(action_names.insert_below, 'Insert Heading Below'));
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
		patch_Tooltip();

		// register toc2 callback - see
		// https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/609
		$(document).on('click', '.toc-item a', toc2_callback);

		// register new actions
		register_new_actions();

		insert_menu_items();

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
