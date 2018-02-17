define([
	'module',
	'jquery',
	'base/js/namespace',
	'base/js/keyboard',
	'notebook/js/cell',
	'notebook/js/codecell',
	'notebook/js/completer',
], function (
	module,
	$,
	Jupyter,
	keyboard,
	cell,
	codecell,
	completer
) {
	'use strict';

	var Cell = cell.Cell;
	var CodeCell = codecell.CodeCell;
	var Completer = completer.Completer;

	var log_prefix = '[' + module.id + ']';

	// default config (updated on nbextension load)
	var config = {
		enable_at_start: true,
		exclude_regexp: ':',
		include_regexp: '',
		tooltip_regexp: '\\(',
		hint_delay: 20,
		hint_inside_comments: false,
	};
	// flag denoting whether hinting is enabled
	var do_hinting;

	// ignore most specially-named keys
	var specials = [
		keyboard.keycodes.enter,
		keyboard.keycodes.esc,
		keyboard.keycodes.backspace,
		keyboard.keycodes.tab,
		keyboard.keycodes.up,
		keyboard.keycodes.down,
		keyboard.keycodes.left,
		keyboard.keycodes.right,
		keyboard.keycodes.shift,
		keyboard.keycodes.ctrl,
		keyboard.keycodes.alt,
		keyboard.keycodes.meta,
		keyboard.keycodes.capslock,
		keyboard.keycodes.space,
		keyboard.keycodes.pageup,
		keyboard.keycodes.pagedown,
		keyboard.keycodes.end,
		keyboard.keycodes.home,
		keyboard.keycodes.insert,
		keyboard.keycodes.delete,
		keyboard.keycodes.numlock,
		keyboard.keycodes.f1,
		keyboard.keycodes.f2,
		keyboard.keycodes.f3,
		keyboard.keycodes.f4,
		keyboard.keycodes.f5,
		keyboard.keycodes.f6,
		keyboard.keycodes.f7,
		keyboard.keycodes.f8,
		keyboard.keycodes.f9,
		keyboard.keycodes.f10,
		keyboard.keycodes.f11,
		keyboard.keycodes.f12,
		keyboard.keycodes.f13,
		keyboard.keycodes.f14,
		keyboard.keycodes.f15
	];

	/**
	 * copied from base/js/keyboard, since it isn't exported
	 * Return `true` if the event only contains modifiers keys.
	 * false otherwise
	 **/
	function only_modifier_event (event) {
		var key = keyboard.inv_keycodes[event.which];
		return (
			(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) &&
			(key === 'alt'|| key === 'ctrl'|| key === 'meta'|| key === 'shift')
		);
	}

	function patch_cell_keyevent () {
		console.log(log_prefix, 'patching Cell.prototype.handle_codemirror_keyevent');
		var orig_handle_codemirror_keyevent = Cell.prototype.handle_codemirror_keyevent;
		Cell.prototype.handle_codemirror_keyevent = function (editor, event) {
			if (do_hinting && (this instanceof CodeCell) && !only_modifier_event(event)) {
				// Tab completion.
				this.tooltip.remove_and_cancel_tooltip();
				// don't attempt completion when selecting, or when using multicursor
				if (    !editor.somethingSelected() &&
						editor.getSelections().length <= 1 &&
						!this.completer.visible &&
						specials.indexOf(event.keyCode) == -1) {
					var cell = this;
					// set a timeout to try to ensure that CodeMirror inserts
					// the new key *before* the completion request happens
					setTimeout(function () {
						var cur = editor.getCursor();
						var pre_cursor = editor.getRange({
							line: cur.line,
							ch: cur.ch - 1
						}, cur);
						if (	pre_cursor !== '' &&
								(config.hint_inside_comments || editor.getTokenAt(cur).type !== "comment") &&
								(config.include_regexp.test(pre_cursor) || config.tooltip_regexp.test(pre_cursor)) &&
								!config.exclude_regexp.test(pre_cursor) ) {
							if (config.tooltip_regexp.test(pre_cursor)) {
								cell.tooltip.request(cell);
							}
							else {
								cell.completer.startCompletion();
								cell.completer.autopick = false;
							}
						}
					}, config.hint_delay);
				}
			}
			return orig_handle_codemirror_keyevent.apply(this, arguments);
		};
	}

	function set_hinterland_state (new_state) {
		do_hinting = new_state;
		$('.hinterland-toggle > .fa')
			.toggleClass('fa-check', do_hinting);
		console.log(log_prefix, 'continuous hinting', do_hinting ? 'on' : 'off');
	}

	function toggle_hinterland () {
		set_hinterland_state(!do_hinting);
	}

	function add_menu_item () {
		if ($('#help_menu').find('.hinterland_toggle').length > 0) {
			return;
		}
		var menu_item = $('<li/>')
			.insertAfter('#keyboard_shortcuts');
		var menu_link = $('<a/>')
			.text('Continuous hints')
			.addClass('hinterland-toggle')
			.attr('title', 'Provide continuous code hints')
			.on('click', toggle_hinterland)
			.appendTo(menu_item);
		$('<i/>')
			.addClass('fa menu-icon pull-right')
			.prependTo(menu_link);
	}

	function load_notebook_extension () {
		
		Jupyter.notebook.config.loaded.then(function on_success () {
			$.extend(true, config, Jupyter.notebook.config.data.hinterland);
			// special defaults:
			// default include is taken from Completer, rather than the blank
			if (config.include_regexp === '') {
				config.include_regexp = Completer.reinvoke_re;
			}
			// now turn regexps loaded from config (which will be strings) into
			// actual RegExp objects.
			var regexp_names = ['exclude_regexp', 'include_regexp', 'tooltip_regexp'];
			for (var ii=0; ii < regexp_names.length; ii++) {
				if (config[regexp_names[ii]] === '') {
					continue;
				}
				try {
					config[regexp_names[ii]] = new RegExp(config[regexp_names[ii]]);
				}
				catch (err) {
					console.warn(log_prefix, 'error parsing', regexp_names[ii] + ':', err);
				}
			}
		}, function on_error (err) {
			console.warn(log_prefix, 'error loading config:', err);
		}).then(function on_success () {
			patch_cell_keyevent();
			add_menu_item();
			set_hinterland_state(config.enable_at_start);
		});
	}

	return {
		load_ipython_extension : load_notebook_extension
	};
});
