(requirejs.specified('base/js/namespace') ? define : function (deps, callback) {
	// if here, the Jupyter namespace hasn't been specified to be loaded.
	// This means that we're probably embedded in a page, so we need to make
	// our definition with a specific module name
	"use strict";
	return define('nbextensions/collapsible_headings/main', deps, callback);
})(['jquery', 'require'], function ($, requirejs) {
	"use strict";

	var mod_name = 'collapsible_headings';
	var log_prefix = '[' + mod_name + ']';
	var action_names = { // set on registration
		insert_above: '',
		insert_below: '',
		collapse: '',
		uncollapse: '',
		select: ''
	};
	var select_reveals = true; // used as a flag to prevent selecting a heading section from also opening it

	// define default values for config parameters
	var params = {
		add_button : false,
		add_all_cells_button: false,
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
			collapse_all: 'ctrl-shift-left',
			uncollapse: 'right',
			uncollapse_all: 'ctrl-shift-right',
			select: 'shift-right',
			insert_above: 'shift-a',
			insert_below: 'shift-b',
		},
		show_section_brackets : false,
		section_bracket_width : 10,
		show_ellipsis : true,
		select_reveals : true,
		collapse_to_match_toc: false,
		indent_px: 8,
	};

	// ------------------------------------------------------------------------
	// Jupyter is used when we're in a live notebook, but in non-live notebook
	// settings, it remains undefined.
	// It is declared here to allow us to keep logic for live/nonlive functions
	// together.
	var Jupyter;
	// similarly, in a live notebook, events is the Jupyter global events
	// object, but in a non-live notebook, we must construct our own version
	var events;
	try {
		events = requirejs('base/js/events');
	}
	catch (err) {
		// in non-live notebook, there's no events structure, so we make our own
		if (window.events === undefined) {
			var Events = function () {};
			window.events = $([new Events()]);
		}
		events = window.events;
	}

	// global flag denoting whether we're in a live notebook or exported html.
	// In a live notebook we operate on Cell instances, in exported html we
	// operate on jQuery collections of '.cell' elements
	var live_notebook = false;


	//  Some functions providing things akin to Jupyter.notebook methods, but
	//  which can work using jQuery collections in place of Cell instances.

	/**
	 *  Return all cells in the notebook (or cell elements if notebook not live)
	 */
	function _get_cells () {
		return live_notebook ? Jupyter.notebook.get_cells() : $('#notebook-container > .cell');
	}

	/**
	 *  Return cell at index index (or cell element if notebook not live)
	 */
	function _get_cell_at_index (index) {
		return live_notebook ? Jupyter.notebook.get_cell(index) : $('.cell').eq(index);
	}

	/**
	 *  Return the index of the given cell (or cell element if notebook not live)
	 */
	function _find_cell_index (cell) {
		return live_notebook ? Jupyter.notebook.find_cell_index(cell) : $(cell).index();
	}

	// ------------------------------------------------------------------------

	/**
	 * Return the level of nbcell.
	 * The cell level is an integer in the range 1-7 inclusive
	 *
	 * @param {Object} cell Cell instance or jQuery collection of '.cell' elements
	 * @return {Integer} cell level
	 */
	function get_cell_level (cell) {
		// headings can have a level up to 6, so 7 is used for a non-heading
		var level = 7;
		if (cell === undefined) {
			return level;
		}
		if (live_notebook) {
			if ((typeof(cell) === 'object')  && (cell.cell_type === 'markdown')) {
			level = cell.get_text().match(/^#*/)[0].length || level;
			}
		}
		else {
			// the jQuery pseudo-selector :header is useful for us, but is
			// implemented in javascript rather than standard css selectors,
			// which get implemented in native browser code.
			// So we get best performance by using css-native first, then filtering
			var only_child_header = $(cell).find(
				'.inner_cell > .rendered_html > :only-child'
			).filter(':header');
			if (only_child_header.length > 0) {
				level = Number(only_child_header[0].tagName.substring(1));
			}
		}
		return Math.min(level, 7); // we rely on 7 being max
	}

	/**
	 * Check if a cell is a heading cell.
	 *
	 * @param {Object} cell Cell instance or jQuery collection of '.cell' elements
	 * @return {Boolean}
	 */
	function is_heading (cell) {
		return get_cell_level(cell) < 7;
	}

	/**
	 *  Check if a heading cell is collapsed.
	 *
	 *  Should in general return false on non-heading cells, but this is
	 *  dependent on metadata/css classes, so don't rely on it.
	 *
	 * @param {Object} cell Cell instance or jQuery collection of '.cell' elements
	 * @return {Boolean}
	 */
	function _is_collapsed (heading_cell) {
		if (live_notebook) {
			return heading_cell.metadata.heading_collapsed === true;
		}
		return $(heading_cell).hasClass('collapsible_headings_collapsed');
	}

	/**
	 *  Alter cell so that _is_collapsed called on it will return set_collapsed
	 */
	function _set_collapsed (heading_cell, set_collapsed) {
		set_collapsed = set_collapsed !== undefined ? set_collapsed : true;
		if (live_notebook) {
			if (set_collapsed) {
				heading_cell.metadata.heading_collapsed = true;
			}
			else {
				delete heading_cell.metadata.heading_collapsed;
			}
		}
		else {
			$(heading_cell).toggleClass('collapsible_headings_collapsed', set_collapsed);
		}
		return set_collapsed;
	}

	/**
	 * Check if a cell is a collapsed heading cell.
	 *
	 * @param {Object} cell Cell instance or jQuery collection of '.cell' elements
	 * @return {Boolean}
	 */
	function is_collapsed_heading (cell) {
		return is_heading(cell) && _is_collapsed(cell);
	}

	/**
	 * Uncollapse any headings which are hiding the cell at index
	 *
	 * @param {Integer} index - index of cell to reveal
	 */
	function reveal_cell_by_index (index) {
		// Restrict the search to cells that are of the same level and lower
		// than the currently selected cell by index.
		var ref_cell = _get_cell_at_index(index);
		// ref_cell may be null, if we've attempted to extend selection beyond
		// the existing cells
		if (!ref_cell) {
			return;
		}
		var pivot_level = get_cell_level(ref_cell);
		var cells = _get_cells();
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
	 *
	 * @param {Object} cell Cell instance or jQuery collection of '.cell' elements
	 * @return {undefined}
	 */
	function update_heading_cell_status (cell) {
		var level = get_cell_level(cell);
		var cell_is_heading = level < 7;
		var cell_elt = live_notebook ? cell.element : $(cell);
		var cht = cell_elt.find('.input_prompt > .collapsible_headings_toggle');
		if (cell_is_heading) {
			var collapsed = _is_collapsed(cell);
			cell_elt.toggleClass('collapsible_headings_collapsed', collapsed);
			cell_elt.toggleClass('collapsible_headings_ellipsis', params.show_ellipsis);
			if (params.use_toggle_controls) {
				if (cht.length < 1) {
					cht = $('<div/>')
						.addClass('collapsible_headings_toggle')
						.css('color', params.toggle_color)
						.append('<div><i class="fa fa-fw"></i></div>')
						.appendTo(cell_elt.find('.input_prompt'));
					var clickable = cht.find('i');
					if (params.make_toggle_controls_buttons) {
						cht.addClass('btn btn-default');
						clickable = cht;
					}
					if (live_notebook) {
						clickable.on('click', function () { toggle_heading(cell); });
					}
					else {
						// in non-live notebook, cell isn;t editable, so make it clickable also
						var only_child_header = cell_elt.find(
							'.inner_cell > .rendered_html > :only-child'
						).filter(':header');
						clickable.add(only_child_header)
							.css('cursor', 'pointer')
							.on('click', function (evt) {
								// evt.target is what was clicked, not what the handler was attached to
								if (!$(evt.target).hasClass('anchor-link')) {
									toggle_heading(cell);
								}
							});
					}
				}
				// Update the cell's toggle control classes
				var hwrap = cht.children();
				hwrap.find('.fa')
					.toggleClass(params.toggle_closed_icon, collapsed)
					.toggleClass(params.toggle_open_icon, !collapsed);
				if (params.size_toggle_controls_by_level) {
					for (var hh = 1; hh < 7; hh++) {
						hwrap.toggleClass('h' + hh, hh == level);
					}
				}
			}
		}
		else {
			_set_collapsed(cell, false);
			cell_elt.removeClass('collapsible_headings_collapsed');
			cht.remove();
		}
	}

	/**
	 * find the closest header cell to input cell
	 *
	 * @param {Object} cell Cell instance or jQuery collection of '.cell' elements
	 * @param {Function} a function to filter which header cells can be
	 *                   returned. Should take a notebook cell/jquer element as
	 *                   input (depending on whether we're in a live notebook),
	 *                   and return true if the given cell is acceptable.
	 * @return {Object | undefined}
	 */
	function find_header_cell (cell, test_func) {
		var index = _find_cell_index(cell);
		for (; index >= 0; index--) {
			cell = _get_cell_at_index(index);
			if (is_heading(cell) && (test_func === undefined || test_func(cell))) {
				return cell;
			}
		}
		return undefined;
	}

	/**
	 *  Select the section enclosed by the given heading cell.
	 *
	 *  Only callable from a live notebook, so require no special cell handling
	 *
	 *  @param {Object} head_cell Cell instance or jQuery collection of '.cell' elements
	 *  @return {undefined}
	 */
	function select_heading_section(head_cell, extend) {
		var head_lvl = get_cell_level(head_cell);
		var ncells = Jupyter.notebook.ncells();
		var head_ind = _find_cell_index(head_cell);
		var tail_ind;
		for (tail_ind = head_ind; tail_ind + 1 < ncells; tail_ind++) {
			if (get_cell_level(_get_cell_at_index(tail_ind + 1)) <= head_lvl) {
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

	/**
	 *  Return all of the cell _elements _which are part of the section headed by
	 *  the given cell
	 *
	 *  @param {Object} head_cell Cell instance or jQuery collection of '.cell' elements
	 */
	function get_jquery_bracket_section (head_cell) {
		var head_lvl = get_cell_level(head_cell);
		var cells = _get_cells();
		var cell_elements = $(live_notebook ? head_cell.element : head_cell);
		for (var ii = _find_cell_index(head_cell); ii < cells.length; ii++) {
			var cell = live_notebook ? cells[ii] : cells.eq(ii);

			if (get_cell_level(cell) <= head_lvl) {
				break;
			}
			cell_elements = cell_elements.add(live_notebook ? cell.element : cell);
		}
		return cell_elements;
	}

	/**
	 * Callback function attached to the bracket-containing div, should toggle
	 * the relevant heading
	 */
	var bracket_callback_timeout_id;
	function bracket_callback (evt) {
		// prevent bubbling, otherwise when closing a section, the cell gets
		// selected & re-revealed after being hidden
		evt.preventDefault();
		evt.stopPropagation();
		// evt.target is what was clicked, not what the handler was attached to
		var bracket = $(evt.target);
		var bracket_level = Number(bracket.attr('data-bracket-level'));
		if (bracket_level) {
			var bracket_cell = live_notebook ? bracket.closest('.cell').data('cell') : bracket.closest('.cell');
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
					if (live_notebook && (bracket_callback_timeout_id === undefined)) {
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
		}
		return false;
	}

	/**
	 * Update the hidden/collapsed status of all the cells under
	 * - the notebook, if param cell === undefined
	 * - the heading which contains the specified cell (if cell !== undefined,
	 *   but is also not a heading)
	 * - the specified heading cell (if specified cell is a heading)
	 *
	 * @param {Object} cell Cell instance or jQuery collection of '.cell' elements
	 * @return {undefined}
	 */
	function update_collapsed_headings (cell) {
		var index = 0;
		var section_level = 0;
		var show = true;
		if (cell !== undefined && (cell = find_header_cell(cell)) !== undefined) {
			index = _find_cell_index(cell) + 1;
			section_level = get_cell_level(cell);
			show = !_is_collapsed(cell);
		}
		var hide_above = 7;
		var brackets_open = {};
		var max_open = 0; // count max number open at one time to calc padding
		for (var cells = _get_cells(); index < cells.length; index++) {
			cell = cells[index];
			var cell_elt = live_notebook ? cell.element : $(cell);
			var level = get_cell_level(cell);
			if (level <= section_level) {
				break;
			}
			if (show && level <= hide_above) {
				cell_elt.slideDown('fast');
				hide_above = is_collapsed_heading(cell) ? level : 7;
				if (live_notebook) {
					delete cell.metadata.hidden;
				}
			}
			else {
				cell_elt.slideUp('fast');
				if (live_notebook) {
					cell.metadata.hidden = true;
				}
				continue;
			}

			if (params.show_section_brackets) {
				var chb = cell_elt.find('.chb').empty();
				if (chb.length < 1) {
					chb = $('<div/>')
						.addClass('chb')
						.on('click dblclick', bracket_callback)
						.appendTo(cell_elt);
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
	 * @param {Object} cell Cell instance or jQuery collection of '.cell' elements
	 */
	function toggle_heading (cell, set_collapsed, trigger_event) {
		if (is_heading(cell)) {
			if (set_collapsed === undefined) {
				set_collapsed = !_is_collapsed(cell);
			}
			_set_collapsed(cell, set_collapsed);
			update_heading_cell_status(cell);
			update_collapsed_headings(params.show_section_brackets ? undefined : cell);
			console.log(log_prefix, set_collapsed ? 'collapsed' : 'expanded', 'cell', _find_cell_index(cell));
			if (trigger_event !== false) {
				events.trigger((set_collapsed ? '' : 'un') + 'collapse.CollapsibleHeading', {cell: cell});
			}
		}
	}

	/**
	 *  Return a promise which resolves when the Notebook class methods have
	 *  been appropriately patched.
	 *  Patches methods
	 *   - Notebook.select
	 *   - Notebook.undelete
	 *
	 *  @return {Promise}
	 */
	function patch_Notebook () {
		return new Promise(function (resolve, reject) {
			requirejs(['notebook/js/notebook'], function on_success (notebook) {
				console.debug(log_prefix, 'patching Notebook.protoype');

				// we have to patch select, since the select.Cell event is only fired
				// by cell click events, not by the notebook select method
				var orig_notebook_select = notebook.Notebook.prototype.select;
				notebook.Notebook.prototype.select = function (index, moveanchor) {
					if (select_reveals) {
						reveal_cell_by_index(index);
					}
					return orig_notebook_select.apply(this, arguments);
				};
				resolve();
			}, reject);
		}).catch(function on_reject (reason) {
			console.warn(log_prefix, 'error patching Notebook.protoype:', reason);
		});
	}

	/**
	 *  Return a promise which resolves when the TextCell class methods have
	 *  been appropriately patched.
	 *
	 *  Patches TextCell.set_text to update headings.
	 *  This is useful for undelete and copy/paste of cells, which don't fire
	 *  markdown.
	 *
	 *  @return {Promise}
	 */
	function patch_TextCell () {
		return new Promise(function (resolve, reject) {
			requirejs(['notebook/js/textcell'], function on_success (textcell) {
				console.debug(log_prefix, 'patching TextCell.protoype');
				var orig_set_text = textcell.TextCell.prototype.set_text;
				textcell.TextCell.prototype.set_text = function (text) {
					var ret = orig_set_text.apply(this, arguments);
					if (Jupyter.notebook._fully_loaded) {
						update_heading_cell_status(this);
						update_collapsed_headings();
					}
					return ret;
				};
				resolve();
			}, reject);
		}).catch(function on_reject (reason) {
			console.warn(log_prefix, 'error patching TextCell.protoype:', reason);
		});
	}

	/**
	 *  Return a promise which resolves when the Tooltip class methods have
	 *  been appropriately patched.
	 *
	 *  For notebook 4.x, cells had css position:static, and changing them to
	 *  relative to get heading brackets working broke the tooltip position
	 *  calculation. In order to fix this, we patch the 4.x Tooltip._show
	 *  method to temporarily reapply position:static while the tooltip
	 *  position is calculated & the animation queued, before revertign to the
	 *  css-appled position:relative.
	 *	For notebook 5.x, cells are already position:relative, so the patch is
	 *  unecessary.
	 *
	 *  @return {Promise}
	 */
	function patch_Tooltip () {
		if (Number(Jupyter.version[0]) >= 5) {
			return Promise.resolve();
		}
		return new Promise(function (resolve, reject) {
			requirejs(['notebook/js/tooltip'], function on_success (tooltip) {
				console.debug(log_prefix, 'patching Tooltip.prototype');

				var orig_tooltip__show = tooltip.Tooltip.prototype._show;
				tooltip.Tooltip.prototype._show = function (reply) {
					var $cell = $(this.code_mirror.getWrapperElement()).closest('.cell');
					$cell.css('position', 'static');
					var ret = orig_tooltip__show.apply(this, arguments);
					$cell.css('position', '');
					return ret;
				};

				resolve();
			}, reject);
		}).catch(function on_reject (reason) {
			console.warn(log_prefix, 'error patching Tooltip.prototype:', reason);
		});
	}

	/**
	 *  Return a promise which resolves when the appropriate Jupyter actions
	 *  have been patched correctly.
	 *
	 *  We patch the up/down arrow actions to skip selecting cells which are
	 *  hidden by a collapsed heading
	 *
	 *  @return {Promise}
	 */
	function patch_actions () {
		return new Promise(function (resolve, reject) {
			requirejs(['notebook/js/tooltip'], function on_success (tooltip) {
				console.debug(log_prefix, 'patching Jupyter up/down actions');

				var kbm = Jupyter.keyboard_manager;

				var action_up = kbm.actions.get("jupyter-notebook:select-previous-cell");
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

				var action_down = kbm.actions.get("jupyter-notebook:select-next-cell");
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

				resolve();
			}, reject);
		}).catch(function on_reject (reason) {
			console.warn(log_prefix, 'error patching Jupyter up/down actions:', reason);
		});
	}

	/**
	 * register actions to collapse and uncollapse the selected heading cell
	 */
	function register_new_actions () {
		action_names.collapse = Jupyter.keyboard_manager.actions.register({
				handler : function (env) {
					var cell = env.notebook.get_selected_cell();
					var is_h = is_heading(cell);
					if (is_h && !_is_collapsed(cell)) {
						toggle_heading(cell, true);
						return;
					}
					var filter_func;
					if (is_h) {
						var lvl = get_cell_level(cell);
						filter_func = function (c) { return get_cell_level(c) < lvl; };
					}
					cell = find_header_cell(cell, filter_func);
					if (cell !== undefined) {
						Jupyter.notebook.select(Jupyter.notebook.find_cell_index(cell));
						cell.focus_cell();
					}
				},
				help : "Collapse the selected heading cell's section",
				icon : params.toggle_closed_icon,
				help_index: 'c1'
			},
			'collapse_heading', mod_name
		);

		action_names.collapse_all = Jupyter.keyboard_manager.actions.register({
				handler : function (env) {
					env.notebook.get_cells().forEach(function (c, idx, arr) {
						toggle_heading(c, true);
					});
					var cell = env.notebook.get_selected_cell();
					if (cell.element.is(':hidden')) {
						cell = find_header_cell(cell, function (c) { return c.element.is(':visible'); });
						if (cell !== undefined) {
							Jupyter.notebook.select(Jupyter.notebook.find_cell_index(cell));
							cell.focus_cell();
						}
					}
				},
				help : "Collapse all heading cells' sections",
				icon : params.toggle_closed_icon,
				help_index: 'c2'
			},
			'collapse_all_headings', mod_name
		);

		action_names.uncollapse = Jupyter.keyboard_manager.actions.register({
				handler : function (env) {
					var cell = env.notebook.get_selected_cell();
					if (is_heading(cell)) {
						toggle_heading(cell, false);
					}
					else {
						var ncells = env.notebook.ncells();
						for (var ii = env.notebook.find_cell_index(cell); ii < ncells; ii++) {
							cell = env.notebook.get_cell(ii);
							if (is_heading(cell)) {
								env.notebook.select(ii);
								cell.focus_cell();
								break;
							}
						}
					}
				},
				help : "Un-collapse (expand) the selected heading cell's section",
				icon : params.toggle_open_icon,
				help_index: 'c3'
			},
			'uncollapse_heading', mod_name
		);

		action_names.uncollapse_all = Jupyter.keyboard_manager.actions.register({
				handler : function (env) {
					env.notebook.get_cells().forEach(function (c, idx, arr) {
						toggle_heading(c, false);
					});
					env.notebook.get_selected_cell().focus_cell();
				},
				help : "Un-collapse (expand) all heading cells' sections",
				icon : params.toggle_open_icon,
				help_index: 'c4'
			},
			'uncollapse_all_headings', mod_name
		);

		action_names.toggle = Jupyter.keyboard_manager.actions.register ({
				handler: function () {
					var heading_cell = find_header_cell(Jupyter.notebook.get_selected_cell(), function (cell) {
						return cell.element.is(':visible') && !_is_collapsed(cell);
					});
					if (is_heading(heading_cell)) {
						toggle_heading(heading_cell, true);
						Jupyter.notebook.select(Jupyter.notebook.find_cell_index(heading_cell));
					}
				},
				help   : "Toggle closest heading's collapsed status",
				icon   : 'fa-angle-double-up',
			},
			'toggle_collapse_heading', mod_name
		);

		action_names.toggle_all = Jupyter.keyboard_manager.actions.register ({
				handler: function () {
					var cells = Jupyter.notebook.get_cells();
					for (var ii = 0; ii < cells.length; ii++) {
						if (is_heading(cells[ii])) {
							Jupyter.keyboard_manager.actions.call(action_names[
								is_collapsed_heading(cells[ii]) ? 'uncollapse_all' : 'collapse_all']);
							return;
						}
					}
				},
				help   : 'Collapse/uncollapse all headings based on the status of the first',
				icon   : 'fa-angle-double-up',
			},
			'toggle_collapse_all_headings', mod_name
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

	/**
	 * Insert a new heading cell either above or below the current section.
	 * only works in a live notebook.
	 */
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
			var cells = _get_cells();
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

	function refresh_all_headings () {
		var cells = _get_cells();
		for (var ii=0; ii < cells.length; ii++) {
			update_heading_cell_status(cells[ii]);
		}
		update_collapsed_headings();
	}

	function set_collapsible_headings_options (options) {
		// options may be undefined here, but it's still handled ok by $.extend
		$.extend(true, params, options);
		// bind/unbind toc-collapse handler
		events[params.collapse_to_match_toc ? 'on' : 'off']('collapse.Toc uncollapse.Toc', callback_toc_collapse);
		// add css for indents
		if (params.indent_px !== 0) {
			var lines = [];
			for (var hh = 1; hh <= 6; hh++) {
				lines.push(
					'.collapsible_headings_toggle .h' + hh +
					' { margin-right: ' + ((6 - hh) * params.indent_px) + 'px; }'
				);
			}
			$('<style id="collapsible_headings_indent_css"/>')
				.html(lines.join('\n'))
				.appendTo('head');
		}
		return params;
	}

	function add_buttons_and_shortcuts () {
		// (Maybe) add buttons to the toolbar
		if (params.add_button) {
			Jupyter.toolbar.add_buttons_group([action_names.toggle]);
		}
		if (params.add_all_cells_button) {
			Jupyter.toolbar.add_buttons_group([action_names.toggle_all]);
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
	}

	var callback_toc_collapse = function (evt, data) {
		// use trigger_event false to avoid re-triggering toc2
		toggle_heading(data.cell, evt.type.indexOf('un') < 0, false);
	}

	/**
	 *  Return a promise which resolves once event handlers have been bound
	 *
	 *  @return {Promise}
	 */
	function bind_events () {

		// Callbacks bound to the create.Cell event can execute before the cell
		// data has been loaded from JSON.
		// So, we rely on rendered.MarkdownCell event to catch headings from
		// JSON, and the only reason we use create.Cell is to update brackets
		function callback_create_cell (evt, data) {
			if (params.show_section_brackets) {
				update_collapsed_headings();
			}
		}

		function callback_delete_cell(evt, data) {
			update_collapsed_headings();
		}

		function callback_markdown_rendered (evt, data) {
			update_heading_cell_status(data.cell);
			// we update all headings to avoid pasted headings ending up hidden
			// by other pre-existing collapsed headings - see
			//     https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/1082
			// for details
			update_collapsed_headings();
		}

		return new Promise (function (resolve, reject) {
			requirejs(['base/js/events'], function on_success (events) {

				// ensure events are detached while notebook loads, in order to
				// speed up loading (otherwise headings are updated for every
				// new cell in the notebook), then reattached when load is
				// complete
				function events_attach () {
					refresh_all_headings();
					events.on('create.Cell', callback_create_cell);
					events.on('delete.Cell', callback_delete_cell);
					events.on('rendered.MarkdownCell', callback_markdown_rendered);
				}
				function events_detach () {
					events.off('create.Cell', callback_create_cell);
					events.off('delete.Cell', callback_delete_cell);
					events.off('rendered.MarkdownCell', callback_markdown_rendered);
				}

				if (Jupyter.notebook._fully_loaded) {
					events_attach();
				}
				events.on('notebook_loaded.Notebook', events_attach);
				events.on('notebook_loading.Notebook', events_detach);

				resolve();
			}, reject);
		}).catch(function on_reject (reason) {
			console.warn(log_prefix, 'error binding events:', reason);
		});
	}

	/**
	 *  Return a menu list item with a link that calls the specified action
	 *  name.
	 *
	 *  @param {String} action_name the name of the action which the menu item
	 *                  should call
	 *  @param {String} menu_item_html the html to use as the link's content
	 *  @return {jQuery}
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
				href: requirejs.toUrl('./main.css')
			})
			.appendTo('head');

		// ensure Jupyter module is defined before proceeding further
		new Promise(function (resolve, reject) {
			requirejs(['base/js/namespace'], function (Jupyter_mod) {
				live_notebook = true;
				Jupyter = Jupyter_mod;
				resolve(Jupyter);
			}, reject);
		})

		// load config & update params
		.then(function (Jupyter) {
			return Jupyter.notebook.config.loaded.catch(function on_err (reason) {
				console.warn(log_prefix, 'error loading config:', reason);
			}).then(function () {
				// may be undefined, but that's ok.
				return Jupyter.notebook.config.data.collapsible_headings;
			});
		})
		// set values using resolution val of previous .then
		.then(set_collapsible_headings_options)

		// apply all promisory things in arbitrary order
		.then(patch_actions)
		.then(patch_Notebook)
		.then(patch_TextCell)
		.then(patch_Tooltip)
		.then(bind_events)
		// finally add user-interaction stuff
		.then(function () {
			register_new_actions();
			insert_menu_items();
			add_buttons_and_shortcuts();
		})
		.catch(function on_reject (reason) {
			console.error(log_prefix, 'error:', reason);
		});
	}

	/**
	 * Export things
	 */
	return {
		get_cell_level : get_cell_level,
		reveal_cell_by_index : reveal_cell_by_index,
		update_collapsed_headings : update_collapsed_headings,
		set_collapsible_headings_options : set_collapsible_headings_options,
		refresh_all_headings: refresh_all_headings,
		load_jupyter_extension : load_jupyter_extension,
		load_ipython_extension : load_jupyter_extension
	};
});
