define(function (require, exports, module) {
	'use strict';

	var keyboard = require('base/js/keyboard');
	var Cell = require('notebook/js/cell').Cell;
	var CodeCell = require('notebook/js/codecell').CodeCell;
	var Completer = require('notebook/js/completer').Completer;

	var log_prefix = '[' + module.id + ']';

	var do_hinting;

	// things ignored by completer keypress, so we also ignore them
	var specials = [
		keyboard.keycodes.enter,
		keyboard.keycodes.esc,
		keyboard.keycodes.backspace,
		keyboard.keycodes.tab,
		keyboard.keycodes.up,
		keyboard.keycodes.down,
		keyboard.keycodes.left,
		keyboard.keycodes.right,
		keyboard.keycodes.pageup,
		keyboard.keycodes.pagedown,
		keyboard.keycodes.space
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

	/**
	 * having autocomplete trigger on a colon is actually really
	 * frustrating, as it means typing the usual newline after the colon
	 * results in inserting the first autocomplete suggestion.
	 * As such, don't show completions if preceding char is a colon
	 */
	var ignore_re = /[:]/i;
	
	function patch_cell_keyevent () {
		console.log(log_prefix, 'patching Cell.prototype.handle_codemirror_keyevent');
		var orig_handle_codemirror_keyevent = Cell.prototype.handle_codemirror_keyevent;
		Cell.prototype.handle_codemirror_keyevent = function (editor, event) {
			if (do_hinting && (this instanceof CodeCell) && !only_modifier_event(event)) {
				// Tab completion.
				this.tooltip.remove_and_cancel_tooltip();
				// don't attempt completion when selecting, or when using multicursor
				if (	!editor.somethingSelected() &&
						editor.getSelections().length <= 1 &&
						!this.completer.visible &&
						specials.indexOf(event.keyCode) == -1) {
					var completer = this.completer;
					// set a timeout to try to ensure that CodeMirror inserts
					// the new key *before* the completion request happens
					setTimeout(function () {
						var cur = editor.getCursor();
						var pre_cursor = editor.getRange({
							line: cur.line,
							ch: cur.ch - 1
						}, cur);

						if (pre_cursor !== '' && !ignore_re.test(pre_cursor)) {
							completer.startCompletion();
							completer.autopick = false;
						}
					}, 200);
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
		patch_cell_keyevent();
		add_menu_item();
		set_hinterland_state(true);
	}

	return {
		load_ipython_extension : load_notebook_extension
	};
});