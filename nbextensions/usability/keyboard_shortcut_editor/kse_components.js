define([
	'bootstrap', // for modals
	'jquery',
	'base/js/dialog',
	'base/js/utils',
	'base/js/keyboard',
	'notebook/js/quickhelp',
	'./quickhelp_shim'
], function(
	bs,
	$,
	dialog,
	utils,
	keyboard,
	quickhelp,
	quickhelp_shim
){
	"use strict";

	function only_modifier_event (event) {
		// adapted from base/js/keyboard
		/**
		 * Return `true` if the event only contains modifiers keys, false
		 * otherwise
		 */
		var key = keyboard.inv_keycodes[event.which];
		return ((event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) &&
			(key === 'alt'|| key === 'ctrl'|| key === 'meta'|| key === 'shift'));
	}

	function editor_build () {
		var editor = $('#kse-editor');
		if (editor.length > 0) {
			return editor;
		}

		editor = $('<div/>')
			.addClass('kse-editor')
			.attr('id', 'kse-editor')
			.data({
				'kse_sequence': [],
				'kse_info': {},
				'kse_mode': 'command',
				'kse_undefined_key': false
			});

		var form = $('<form/>')
			.addClass('form')
			.appendTo(editor);

		$('<div/>')
			.addClass('form-group')
			.appendTo(form);

		var form_group = $('<div/>')
			.addClass('form-group has-feedback')
			.appendTo(form);

		var input_group = $('<div/>')
			.addClass('input-group')
			.addClass('kse-input-group')
			.appendTo(form_group);

		// reset button
		var btn = $('<a/>')
			.addClass('btn btn-default')
			.addClass('kse-input-group-reset')
			.attr({
				'title': 'Restart',
				'type': 'button'
			})
			.append(
				$('<i/>')
					.addClass('fa fa-repeat')
			)
			.on('click', function () {
				editor.data({
					'kse_sequence': [],
					'kse_undefined_key': false
				});
				editor_update_input_group(editor);
				$(this).blur();
				textcontrol.focus();
			});
		$('<div/>')
			.addClass('input-group-btn')
			.append(btn)
			.appendTo(input_group);

		// pretty-displayed shortcut
		$('<div/>')
			.addClass('input-group-addon')
			.addClass('kse-input-group-pretty')
			.addClass('kse-editor-to')
			.appendTo(input_group);

		var textcontrol = $('<input/>')
			.addClass('form-control')
			.addClass('kse-input-group-input')
			.attr({
				'type': 'text',
				'placeholder': 'click here to edit the shortcut'
			})
			.on('keydown', editor_handle_shortcut_keydown)
			.on('focus', function (evt) {
				$(this).attr('placeholder', 'press keys to add to the shortcut');
			})
			.on('blur', function (evt) {
				$(this).attr('placeholder', 'click here to edit the shortcut');
			})
			.appendTo(input_group);

		// feedback icon
		var form_fdbck = $('<i/>')
			.addClass('fa fa-lg');
		$('<span/>')
			.addClass('form-control-feedback')
			.append(form_fdbck)
			.appendTo(form_group);

		// help for input group
		$('<span/>')
			.addClass('help-block')
			.appendTo(form_group);

		return editor;
	}

	function editor_update_input_group (editor, seq) {
		seq = seq || editor.data('kse_sequence');
		var shortcut = seq.join(',');
		var mode = editor.data('kse_mode');
		var have_seq = seq.length > 0;
		var valid = have_seq;

		// empty help block
		var feedback = editor.find('.form-group.has-feedback:first');
		var help_block = feedback.find('.help-block');
		help_block.empty();

		var ii;
		var has_comma = false;
		for (ii = 0; !has_comma && (ii < seq.length); ii++) {
			has_comma = seq[ii].indexOf(',') >= 0;
		}

		if (has_comma) {
			valid = false;
			// use HTML Unicode escape for a comma, to get it to look right in the pretty version
			shortcut = $.map(seq, function (elem, idx) {
				return elem.replace(',', '&#44;');
			}).join(',');

			$('<p/>')
				.html(
					'Unfortunately, Jupyter\'s handling of shortcuts containing ' +
					'commas (<kbd>,</kbd>) is fundamentally flawed, ' +
					'as the comma is used as the key-separator character &#9785;. ' +
					'Please try something else for your rebind!'
				)
				.appendTo(help_block);
		}
		else if (have_seq) {
			var conflicts = {};
			var tree;

			// get existing shortcuts
			if (Jupyter.keyboard_manager !== undefined) {
				var startkey = seq.slice(0, 1)[0];
				if (mode === 'command') {
					tree = Jupyter.keyboard_manager.command_shortcuts.get_shortcut(startkey);
				}
				else {
					tree = Jupyter.keyboard_manager.edit_shortcuts.get_shortcut(startkey);
					// deal with codemirror shortcuts specially, since they're not included in kbm
					for (var jj = 0; jj < quickhelp.cm_shortcuts.length; jj++) {
						var cm_shrt = quickhelp.cm_shortcuts[jj];
						if (keyboard.normalize_shortcut(cm_shrt.shortcut) === startkey) {
							tree = cm_shrt.help;
							break;
						}
					}
				}
			}

			// check for conflicting shortcuts.
			// Start at 1 because we got tree from startkey
			for (ii = 1; (ii < seq.length) && (tree !== undefined); ii++) {
				// check for exsiting definitions at current specificity
				if (typeof(tree) === 'string') {
					valid = false;
					conflicts[seq.slice(0, ii).join(',')] = tree;
					break;
				}
				tree = tree[seq[ii]];
			}
			
			// check whether any more-specific shortcuts were defined
			if ((ii === seq.length) && (tree !== undefined)) {
				valid = false;
				var flatten_conflict_tree = function flatten_conflict_tree (obj, key) {
					if (typeof(obj) === 'string') {
						conflicts[key] = obj;
					}
					else for (var subkey in obj) {
						if (obj.hasOwnProperty(subkey)) {
							flatten_conflict_tree(obj[key], [key, subkey].join(','));
						}
					}
				};
				flatten_conflict_tree(tree, seq.join(','));
			}

			if (!valid) {
				var plural = Object.keys(conflicts).length != 1;
				$('<p/>')
					.append(quickhelp.humanize_sequence(seq.join(',')))
					.append(
						' conflicts with the' + (plural ? ' following' : '') +
						' existing shortcut' + (plural ? 's' : '') + ':'
					)
					.appendTo(help_block);

				for (var conflicting_shortcut in conflicts) {
					if (conflicts.hasOwnProperty(conflicting_shortcut)) {
						$('<p/>')
							.append(quickhelp.humanize_sequence(conflicting_shortcut))
							.append($('<code/>').text(conflicts[conflicting_shortcut]))
							.appendTo(help_block);
					}
				}
			}
		}

		if (editor.data('kse_undefined_key')) {
			var warning = $('<span/>')
				.addClass('form-group has-feedback has-warning kse-undefined')
				.append(
					$('<span/>')
						.addClass('help-block')
						.append(
							$('<p/>').text('Unrecognised key! (code ' + editor.data('kse_undefined_key' ) + ')')
						)
				);

			var existing = editor.find('.kse-undefined');
			if (existing.length > 0) {
				existing.replaceWith(warning);
			}
			else {
				warning.insertAfter(feedback);
			}
			setTimeout(function () {
				warning.remove();
			}, 2000);
		}

		// disable reset button if no sequence
		editor.find('.kse-input-group-reset')
			.toggleClass('disabled', !have_seq);

		editor.find('.kse-input-group-pretty')
			.html(shortcut ? quickhelp.humanize_sequence(shortcut) : '&lt;new shortcut&gt;');

		feedback
			.toggleClass('has-error', !valid && have_seq)
			.toggleClass('has-success', valid && have_seq)
			.find('.form-control-feedback .fa')
				.toggleClass('fa-remove', !valid && have_seq)
				.toggleClass('fa-check', valid && have_seq);
	}

	function editor_handle_shortcut_keydown (evt) {
		var elem = $(evt.delegateTarget);
		if (!only_modifier_event(evt)) {
			var shortcut = keyboard.normalize_shortcut(keyboard.event_to_shortcut(evt));
			var editor = elem.closest('#kse-editor');
			var seq = editor.data('kse_sequence');
			var has_undefined_key = (shortcut.toLowerCase().indexOf('undefined') !== -1);
			editor.data('kse_undefined_key', has_undefined_key);
			if (has_undefined_key) {
				// deal with things like ~ appearing on apple alt-n, or ¨ on alt-u
				editor.find('.kse-input-group-input').val('');
				editor.data('kse_undefined_key', evt.which || true);
			}
			else {
				seq.push(shortcut);
			}
			editor_update_input_group(editor, seq);
		}
	}

	function modal_build (editor, modal_options) {
		var modal = $('#kse-editor-modal');
		if (modal.length > 0) {
			return modal;
		}

		var default_modal_options = {
			'destroy': false,
			'show': false,
			'title': 'Edit keyboard shortcut',
			'body': editor,
			'buttons': {
				'OK': {'class': 'btn-primary'},
				'Cancel': {}
			},
			'open': function (evt) {
				$(this).find('.kse-input-group-input').focus();
			}
		};
		if (Jupyter.notebook !== undefined) {
			default_modal_options.notebook = Jupyter.notebook;
		}
		if (Jupyter.keyboard_manager !== undefined) {
			default_modal_options.keyboard_manager= Jupyter.keyboard_manager;
		}
		modal_options = $.extend({}, default_modal_options, modal_options);

		modal = dialog.modal(modal_options);

		modal
			.addClass('modal_stretch')
			.attr('id', 'kse-editor-modal');

		// Add a data-target attribute to ensure buttons only target the editor modal
		modal.find('.close,.modal-footer button')
			.attr('data-target', '#kse-editor-modal');

		return modal;
	}

	/**
	 * Pass it an option dictionary with any of the bootstrap or base/js/dialog
	 * modal options, plus the following optional properties:
	 * - description: html for the form group preceding the editor group,
	 *   useful as a description
	 */
	function KSE_modal (modal_options) {
		var editor = editor_build();
		editor.data({'kse_sequence': [], 'kse_undefined_key': false});
		editor_update_input_group(editor);
		var modal = modal_build(editor, modal_options);

		editor.on('keydown', '.kse-input-group-input', function (evt) {
			event.preventDefault();
			event.stopPropagation();
			return false;
		});

		if (modal_options.description) {
			modal.find('.modal-body .form-group:first').html(modal_options.description);
		}

		return modal;
	}

	return {
		editor_build : editor_build,
		editor_update_input_group: editor_update_input_group,
		modal_build : modal_build,
		KSE_modal : KSE_modal
	};
});
