define(function (require, exports, module) {
	'use strict';

	// var Jupyter = require('base/js/namespace');
	var keyboard = require('base/js/keyboard');
	var Cell = require('notebook/js/cell').Cell;
	var CodeCell = require('notebook/js/codecell').CodeCell;
	var Completer = require('notebook/js/completer').Completer;

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
		console.log('[' + module.id + '] patching Cell.prototype.handle_codemirror_keyevent');
		var orig_handle_codemirror_keyevent = Cell.prototype.handle_codemirror_keyevent;
		Cell.prototype.handle_codemirror_keyevent = function (editor, event) {
			if (this instanceof CodeCell && !only_modifier_event(event)) {
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

	return {
		load_ipython_extension : patch_cell_keyevent
	};
});