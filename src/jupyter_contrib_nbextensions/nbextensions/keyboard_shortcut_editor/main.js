define([
	'jquery',
	'require',
	'base/js/namespace',
	'base/js/dialog',
	'base/js/events',
	'base/js/keyboard',
	'base/js/utils',
	'services/config',
	'notebook/js/quickhelp',
	'./quickhelp_shim',
	'./kse_components',
], function (
	$,
	require,
	Jupyter,
	dialog,
	events,
	keyboard,
	utils,
	configmod,
	quickhelp,
	qh_shim,
	kse_comp
) {
	"use strict";

	var mod_name = 'keyboard_shortcut_editor';

	// create config object to load parameters
	var base_url = utils.get_body_data('baseUrl');
	var config = new configmod.ConfigSection('notebook', {base_url: base_url});

	// define default values for config parameters
	var params = {
		'kse_show_rebinds': true,
		// mode, action name, new combo
		'kse_rebinds': {
			// command-mode rebindings
			'command': [
				// { // disable the default 'space' shortcut, which used to scroll the notebook down
				//	from: "space",
				//	action_name: "jupyter-notebook:scroll-notebook-down"
				// },
				// { // create a new shortcut 't,t' to trust the notebook
				//	action_name: "jupyter-notebook:trust-notebook",
				//	to: "t,t"
				// },
				// { // change the default save-notebook shortcut from 's' to 'shift-s'
				//	action_name: "jupyter-notebook:save-notebook",
				//	to: "shift-s",
				//	from: "s"
				// }
			],
			// edit-mode rebindings:
			"edit": [
				// { // disable the default edit-mode binding which switches to command mode
				//	action_name: "jupyter-notebook:enter-command-mode",
				//	from: "ctrl-m"
				// }
			]
		}
	};
	// function to update params with any specified in the server's config file
	function update_params () {
		for (var key in params) {
			if (config.data.hasOwnProperty(key)) {
				params[key] = config.data[key];
			}
		}
	}

	function add_css (url) {
		$('<link/>')
			.attr({
				'rel': 'stylesheet',
				'type': 'text/css',
				'href': require.toUrl(url)
			})
			.appendTo($('head'));
	}

	var kbm = Jupyter.keyboard_manager;
	var deleted_shortcuts = {
		'command': new keyboard.ShortcutManager(undefined, kbm.command_shortcuts.events, kbm.actions, kbm.env),
		'edit': new keyboard.ShortcutManager(undefined, kbm.edit_shortcuts.events, kbm.actions, kbm.env)
	};
	
	var patched_quickhelp_prototype = false;
	var patched_shortcut_manager_prototype = false;

	function patch_shortcut_manager_prototype () {
		if (!patched_shortcut_manager_prototype) {
			var orig_add_shortcut = keyboard.ShortcutManager.prototype.add_shortcut;
			keyboard.ShortcutManager.prototype.add_shortcut = function add_shortcut (shortcut, data, suppress_help_update, called_by_rebinder) {
				if (!called_by_rebinder) {
					var this_mode;
					if (this === kbm.edit_shortcuts) {
						this_mode = 'edit';
					}
					else if (this === kbm.command_shortcuts) {
						this_mode = 'command';
					}
					if (this_mode) {
						var rebind_specs = params.kse_rebinds[this_mode];
						for (var ii = 0; ii < rebind_specs.length; ii++) {
							var spec = rebind_specs[ii];
							if (spec.from === shortcut) {
								if (!spec.to) {
									return;
								}
								shortcut = spec.to;
							}
						}
					}
				}
				return orig_add_shortcut.call(this, shortcut, data, suppress_help_update);
			};
			console.log('[' + mod_name + '] patched ShortcutManager.prototype.add_shortcut');
			patched_shortcut_manager_prototype = true;
		}
	}

	function patch_quickhelp_prototype () {
		if (!patched_quickhelp_prototype) {
			var orig_build_command_help = quickhelp.QuickHelp.prototype.build_command_help;
			quickhelp.QuickHelp.prototype.build_command_help = function () {
				var div = orig_build_command_help.call(this);
				return quickhelp_div_add_rebind_controls(div, 'command');
			};
			console.log('[' + mod_name + '] patched QuickHelp.prototype.build_command_help');

			var orig_build_edit_help = quickhelp.QuickHelp.prototype.build_edit_help;
			quickhelp.QuickHelp.prototype.build_edit_help = function (cm_shortcuts) {
				var div = orig_build_edit_help.call(this, cm_shortcuts);
				return quickhelp_div_add_rebind_controls(div, 'edit');
			};
			console.log('[' + mod_name + '] patched QuickHelp.prototype.build_edit_help');
			
			patched_quickhelp_prototype = true;
		}
	}

	function load_jupyter_extension () {
		add_css('./main.css');
		patch_shortcut_manager_prototype();
		patch_quickhelp_prototype();
		config.load();
	}

	function get_mode_shortcuts (mode, deleted) {
		if (deleted) {
			return deleted_shortcuts[mode];
		}
		else if (mode === 'command') {
			return kbm.command_shortcuts;
		}
		else if (mode === 'edit') {
			return kbm.edit_shortcuts;
		}
		return undefined;
	}

	function rebind (mode, spec, suppress_help_update) {
		var shortcuts = get_mode_shortcuts(mode);
		if (spec.action_name === undefined) {
			spec.action_name = shortcuts.get_shortcut(spec.from);
		}
		if (!shortcuts.actions.exists(spec.action_name)) {
			console.warn(
				'[' + mod_name + '] ' +
				'rebind specified for unrecognised action "' +
				spec.action_name + '"' +
				(spec.from ? ' from ' + spec.from : '') +
				(spec.to ? ' to ' + spec.to : '')
			);
		}
		else {
			console.log(
				'[' + mod_name + '] ' +
				(spec.from ? (spec.to ? 're' : 'un') : '') + 'bound ' +
				spec.action_name +
				(spec.from ? ' from ' + spec.from : '') +
				(spec.to ? ' to ' + spec.to : '')
			);

			if (spec.from) {
				if (!spec.to) {
					deleted_shortcuts[mode].add_shortcut(spec.from, spec.action_name, true, true);
				}
				shortcuts.remove_shortcut(spec.from);
			}
			if (spec.to) {
				return shortcuts.add_shortcut(spec.to, spec.action_name, suppress_help_update, true);
			}
		}
	}

	function apply_config_rebinds () {
		var modes = ['command', 'edit'];
		for (var mm = 0; mm < modes.length; mm++) {
			var mode = modes[mm];
			if (params.kse_rebinds.hasOwnProperty(mode)) {
				var rebind_specs = params.kse_rebinds[mode];
				for (var ii = 0; ii < rebind_specs.length; ii++) {
					rebind(mode, rebind_specs[ii], true);
				}
			}
		}
		events.trigger('rebuild.QuickHelp');
	}

	config.loaded.then(function () {
		update_params();
		apply_config_rebinds();
		var title = $('#keyboard_shortcuts').attr('title');
		$('#keyboard_shortcuts').attr('title',  title + ' & controls to edit them');
	});

	function reverse_spec (spec) {
		var new_spec = {action_name: spec.action_name};
		if (spec.from) {
			new_spec.to = spec.from;
		}
		if (spec.to) {
			new_spec.from = spec.to;
		}
		return new_spec;
	}

	function find_rebinding (rebinds, partial_spec, index_only) {
		for (var ii = 0; ii < rebinds.length; ii++) {
			if (((partial_spec.to === undefined) ||
					(partial_spec.to === rebinds[ii].to)) &&
				((partial_spec.from === undefined) ||
					(partial_spec.from === rebinds[ii].from)) &&
				((partial_spec.action_name === undefined) ||
					(partial_spec.action_name === rebinds[ii].action_name))) {
				return index_only ? ii : rebinds[ii];
			}
		}
		return undefined;
	}

	function register_rebinding (mode, spec) {
		var rebinds = params.kse_rebinds[mode];
		rebinds.push($.extend({}, spec));
		// write our private copy to the config:
		config.update(params);
		console.log('[' + mod_name + '] rebinding added:', spec);
	}

	function deregister_rebinding (mode, partial_spec) {
		var rebinds = params.kse_rebinds[mode];
		var idx = find_rebinding(rebinds, partial_spec, true);
		if (idx === undefined) {
			console.warn('[' + mod_name + '] attempted to delete non-exsitent shortcut:', partial_spec);
			return undefined;
		}
		var deleted = rebinds.splice(idx, 1)[0];
		// write our private copy to the config:
		config.update(params);
		console.log('[' + mod_name + '] rebinding removed:', deleted);
		return deleted;
	}

	function action_selector (default_pair) {
		var select = $('<select/>')
			.append(
				$('<option/>')
					.attr('value', '')
					.text('select an action')
			)
			.addClass('form-control select-xs');

		var action_names = [];
		$.each(kbm.actions._actions, function (key, val) {
			if (key !== 'ignore') {
				action_names.push(key);
			}
		});
		action_names.sort();

		for (var ii = 0; ii < action_names.length; ii++) {
			select.append(
				$('<option/>')
					.attr('value', action_names[ii])
					.append(
						$('<code/>')
							.text(action_names[ii])
					)
					// .text(kbm.actions.get(action_name).help)
			);
		}
		return select;
	}

	function quickhelp_rebuild_mode_div (div) {
		if ((div === undefined) || (div.data('kse_mode') === 'command')) {
			div.replaceWith(Jupyter.quick_help.build_command_help());
		}
		if ((div === undefined) || (div.data('kse_mode') === 'edit')) {
			div.replaceWith(Jupyter.quick_help.build_edit_help(quickhelp.cm_shortcuts));
		}
		return div;
	}

	function modal_update_ok_disable_status (evt) {
		var editor = $(evt.delegateTarget);
		if (!editor.is('#kse-editor')) {
			editor = editor.closest('#kse-editor');
		}
		var feedback = editor.find('.has-feedback:first');
		var valid = feedback.hasClass('has-success');
		if (valid) {
			valid = valid && editor.data('kse_sequence').length > 0;
		}
		var modal = editor.closest('#kse-editor-modal');
		if (valid) {
			var select = modal.find('select');
			if (select.length > 0) {
				valid = valid && select.val();
			}
		}
		modal.find('.modal-footer button:first').prop('disabled', !valid);
	}


	function modal_ok_click_callback (evt) {
		var editor = $('#kse-editor');
		var new_shortcut = editor.data('kse_sequence').join(',');
		var info = editor.data('kse_info');
		var mode = editor.data('kse_mode');
		var new_spec = {
			'action_name': info.action_name,
			'to': new_shortcut
		};
		if (info.rebound) {
			// editing an existing rebinding
			deregister_rebinding(mode, info.spec);
			// rebind directly
			rebind(mode, $.extend({'from': info.spec.to}, new_spec), true);
			// get registration correct
			new_spec.from = info.spec.from;
		}
		else {
			if (info.spec.to) {
				// editing an existing binding, so ensure there's a from
				new_spec.from = info.spec.to;
			}
			rebind(mode, new_spec, true);
		}
		if (new_spec.from !== new_spec.to) {
			register_rebinding(mode, new_spec);
		}
		quickhelp_rebuild_mode_div(info.div);
	}

	var modal_options_for_edit = {
		backdrop: false,
		buttons: {
			OK: {
				'class':'btn-primary',
				'click': modal_ok_click_callback
			},
			Cancel: {}
		}
	};

	function modal_prepare_editor(modal, editor, info) {
		// ensure events are bound
		if (!editor.data('kse_modal_events_bound')) {
			editor.on('keydown', '.kse-input-group-input', function (evt) {
				evt.preventDefault();
				evt.stopPropagation();
				modal_update_ok_disable_status(evt);
				return false;
			});
			editor.on('click', '.kse-input-group-reset', modal_update_ok_disable_status);
			editor.on('change', 'select', modal_update_ok_disable_status);
			editor.data('kse_modal_events_bound', true);
		}
		// reset data
		editor.data('kse_sequence', []);
		editor.data('kse_info', info);
		editor.data('kse_mode', info.mode);
		editor.find('.kse-input-group-reset').click();

		// add description
		var descript_div = editor.find('.form-group:first').empty();
		if (info.action_name) { // this is a rebind
			descript_div
				.append('Rebinding ')
				.append(
					$('<code/>')
						.addClass('kse-action')
						.text(info.spec.action_name)
				)
				.append(' from ')
				.append(
					$('<span/>')
						.addClass('kse-from')
						.html(quickhelp.humanize_sequence(info.spec.to || ''))
				)
				.append(' to:');
		}
		else {
			// this is a nubind
			var select = action_selector();
			select.on('change', function (event) {
				var action_name = $(this).val();
				$.extend(true, info, {'action_name': action_name, 'spec': {'action_name': action_name}});
			});
			descript_div
				.append('Bind ')
				.append(select)
				.append(' to:');
		}
		kse_comp.editor_update_input_group(editor);
	}

	function modal_show_above_quickhelp_modal(modal) {
		// add a custom backdrop which covers the quickhelp modal.
		// We do this every time, as bootstrap destroys it every time.
		var backdrop = modal.data('bs.modal').$backdrop = $('<div/>')
			.attr('id', 'kse-modal-backdrop')
			.addClass('kse-modal-backdrop')
			.addClass('modal-backdrop fade')
			.appendTo(Jupyter.quick_help.shortcut_dialog.find('.modal-content'));

		// get offsetWidth to force reflow, otherwise animation doesn't show
		var tmp = backdrop[0].offsetWidth;
		// now trigger animation by adding class
		backdrop
			.addClass('in');
		// show the modal once the (backdrop) transition is complete
		backdrop
			.one('bsTransitionEnd', function () {
				modal.modal('show');
			})
			.emulateTransitionEnd(150);
	}

	function build_rebind_rep_list (mode) {
		var rep_list = $('<div/>')
			.addClass('kse-rep-list');

		var shortcuts = get_mode_shortcuts(mode);
		var rebind_specs = params.kse_rebinds[mode];
		
		for (var ii = 0; ii < rebind_specs.length; ii++) {
			var spec = rebind_specs[ii];
			var verb = (spec.from ? (spec.to ? 're' : 'un') : '') + 'bound';
			var rep = $('<div/>')
				.append(
					$('<code/>')
						.text(spec.action_name)
				)
				.append(' ' + verb)
				.appendTo(rep_list);
			if (spec.from) {
				rep.append(' from ' + quickhelp.humanize_sequence(spec.from));
			}
			if (spec.to) {
				rep.append(' to ' + quickhelp.humanize_sequence(spec.to));
			}
		}

		return rep_list;
	}

	function btn_get_info (btn) {
		/**
		 * get the shortcut info associated with a quickhelp button element
		 */
		var info = {};
		btn = info.btn = $(btn);
		var qh_div = info.qh_div = btn.closest('.quickhelp');
		var div = info.div = qh_div.closest('.kse-div');

		var mode = info.mode = div.data('kse_mode');
		var unbound = info.unbound = qh_div.hasClass('kse-unbound');
		var rebound = info.rebound = qh_div.hasClass('kse-rebound');
		info.nubound = qh_div.hasClass('kse-nubound');

		var shortcuts = info.shortcuts = get_mode_shortcuts(mode, unbound);
		// Make sure we remove jupyter-notebook:ignore shortcuts.
		var shortcut_help_arr = info.shortcut_help_arr =  shortcuts.help().filter(
			function (shortcut) {
				return (shortcut.help !== 'ignore');
			}
		);

		var idx = info.idx = div.find('.quickhelp:not(.kse-links,.kse-codemirror)')[unbound ? 'filter' : 'not']('.kse-unbound').index(qh_div);

		var keycombo = info.keycombo = shortcut_help_arr[idx].shortcut;
		var action_name = info.action_name = shortcuts.get_shortcut(keycombo);
		var spec = info.spec = {
			'to': keycombo,
			'action_name': action_name
		};
		if (rebound) {
			spec.from = find_rebinding(params.kse_rebinds[mode], spec).from;
		}
		return info;
	}

	function btn_del_callback (evt) {
		evt.preventDefault(); // ignore #

		var info = btn_get_info(evt.delegateTarget);
		var spec = info.spec;
		var rev_spec = reverse_spec(spec);
		rebind(info.mode, rev_spec, true);

		if (info.nubound) {
			// don't want deleted new binds to show up in deleted shortcuts
			deleted_shortcuts[info.mode].remove_shortcut(spec.to);
			deregister_rebinding(info.mode, spec);
		}
		else if (info.rebound) {
			// get rid of existing rebinding
			deregister_rebinding(info.mode, spec);
			// add a new rebinding for the deletion
			delete spec.to;
			rebind(info.mode, spec, true);
			register_rebinding(info.mode, spec);
		}
		else {
			register_rebinding(info.mode, rev_spec);
		}
		quickhelp_rebuild_mode_div(info.div);
	}

	function btn_rst_callback (evt) {
		evt.preventDefault(); // ignore #

		var info = btn_get_info(evt.delegateTarget);
		var spec = info.spec;
		if (info.unbound) {
			spec = reverse_spec(spec);
			deleted_shortcuts[info.mode].remove_shortcut(spec.from);
		}
		rebind(info.mode, reverse_spec(spec), true);
		deregister_rebinding(info.mode, spec);
		
		quickhelp_rebuild_mode_div(info.div);
	}

	function btn_edt_callback (evt) {
		evt.preventDefault(); // ignore #

		var info = btn_get_info(evt.delegateTarget);
		var spec = reverse_spec(info.spec);
		// see if the shortcut was already rebound...
		var rebinds = params.kse_rebinds[info.mode];
		for (var ii = 0; ii < rebinds.length; ii++) {
			if (rebinds[ii].to === spec.from) {
				spec = rebinds[ii];
				break;
			}
		}

		var editor = kse_comp.editor_build();
		var modal = kse_comp.modal_build(editor, modal_options_for_edit);
		
		modal_prepare_editor(modal, editor, info);
		modal_show_above_quickhelp_modal(modal);
	}

	function btn_add_callback (evt) {
		evt.preventDefault(); // don't use #

		var div = $(evt.delegateTarget).closest('.kse-div');
		var mode = div.data('kse_mode');
		var info = {
			'div': div,
			'spec': {},
			'shortcuts': get_mode_shortcuts(mode),
			'keycombo': '',
			'action_name': '',
			'mode': mode
		};

		var editor = kse_comp.editor_build();
		var modal = kse_comp.modal_build(editor, modal_options_for_edit);
		
		modal_prepare_editor(modal, editor, info);
		modal_show_above_quickhelp_modal(modal, editor, info);
	}

	function btn_view_callback (evt) {
		evt.preventDefault(); // don't use #

		var div = $(evt.delegateTarget).closest('.kse-div');
		var mode = div.data('kse_mode');
		var modal = dialog.modal({
			backdrop: false, // a custom one gets added by modal_show_above_quickhelp_modal
			show: false,
			title : mode.substring(0, 1).toUpperCase() + mode.substring(1) + '-mode keyboard shortcut edits',
			body : build_rebind_rep_list(mode),
			buttons: {'OK': {}},
			notebook: Jupyter.notebook,
			keyboard_manager: Jupyter.keyboard_manager
		});

		modal
			.addClass('modal_stretch')
			.attr('id', 'kse-view-modal');

		// Add a data-target attribute to ensure buttons only target this modal
		modal.find('.close,.modal-footer button')
			.attr('data-target', '#kse-view-modal');
		modal_show_above_quickhelp_modal(modal);
	}

	function build_button_menu (idx, qh_div) {
		qh_div = $(qh_div);

		var grp = $('<div/>')
			.addClass('btn-group btn-group-xs')
			.addClass('kse-dropdown')
			.addClass('hidden-print')
			.appendTo(qh_div);

		var btn = $('<button/>')
			.addClass('btn btn-default')
			.attr('type', 'button')
			.appendTo(grp);

		if (qh_div.hasClass('kse-codemirror')) {
			btn
				.addClass('disabled')
				.attr('title', 'Editing Codemirror shortcuts is not supported')
				.html('<i class="fa">cm</i>');
		}
		else if (qh_div.hasClass('kse-unbound')) {
			btn
				.on('click', btn_rst_callback)
				.attr('title', 'Re-enable shortcut')
				.html('<i class="fa fa-repeat"/>');
		}
		else if (qh_div.hasClass('kse-nubound')) {
			btn
				.on('click', btn_del_callback)
				.attr('title', 'Delete custom shortcut')
				.html('<i class="fa fa-trash"/>');
		}
		else {
			btn
				.attr({
					'title': 'Edit',
					'data-toggle': 'dropdown',
					'aria-haspopup': 'true',
					'aria-expanded': 'false'
				})
				.addClass('dropdown-toggle')
				.html('<i class="fa fa-pencil"/> <i class="fa fa-caret-down"/>');
			
			var mnu = $('<ul/>')
				.addClass('dropdown-menu dropdown-menu-right')
				.appendTo(grp);
			$('<li/>')
				.html('<a href="#" title="Edit shortcut"><i class="fa fa-pencil"></i> Edit</a>')
				.on('click', btn_edt_callback)
				.appendTo(mnu);
			if (qh_div.hasClass('kse-rebound')) {
				$('<li/>')
					.on('click', btn_rst_callback)
					.html('<a href="#" title="Reset shortcut to default key(s)"><i class="fa fa-repeat"></i> Reset</a>')
					.appendTo(mnu);
			}
			$('<li/>')
				.on('click', btn_del_callback)
				.html('<a href="#" title="Disable shortcut"><i class="fa fa-ban"></i> Disable</a>')
				.appendTo(mnu);
		}

		return grp;
	}

	function quickhelp_div_add_rebind_controls (div, mode) {
		if (!params.kse_show_rebinds) {
			return div;
		}

		div
			.data('kse_mode', mode)
			.addClass('kse-div');
		
		var nubound_shortcuts = [];
		var rebound_shortcuts = [];
		for (var ii = 0; ii < params.kse_rebinds[mode].length; ii++) {
			var spec = params.kse_rebinds[mode][ii];
			if (spec.to) {
				(spec.from ? rebound_shortcuts : nubound_shortcuts).push(spec.to);
			}
		}

		var shortcuts = get_mode_shortcuts(mode);
		var shortcut_help_arr = shortcuts.help();
		// add codemirror shortcuts in edit mode
		if (mode === 'edit') {
			shortcut_help_arr = $.merge($.merge([], quickhelp.cm_shortcuts), shortcut_help_arr);
		}
		// Remove jupyter-notebook:ignore shortcuts.
		shortcut_help_arr = shortcut_help_arr.filter(function(shortcut) {
			return (shortcut.help !== 'ignore');
		});

		// label quickhelp divs with classes
		div.find('.quickhelp').each(function (idx, elem) {
			var keycombo = shortcut_help_arr[idx].shortcut;
			var action_name = shortcuts.get_shortcut(keycombo);
			if (mode === 'edit' && action_name === undefined) {
				$(elem).addClass('kse-codemirror');
			}
			else if (nubound_shortcuts.indexOf(keycombo) >= 0) {
				$(elem).addClass('kse-nubound');
			}
			else if (rebound_shortcuts.indexOf(keycombo) >= 0) {
				$(elem).addClass('kse-rebound');
			}
		});

		// (maybe) add a set of rebinds and deleted shortcuts
		div.find('.kse-rep-list').remove();
		var cont = div.find('.container-fluid:first');
		
		var del_div = quickhelp.build_div('<h5>Disabled:<h5/>', deleted_shortcuts[mode].help());
		del_div
			.addClass('hidden-print')
			.addClass('text-danger hidden-print');
		if (del_div.find('.quickhelp').addClass('kse-unbound').length > 0) {
			del_div
				.insertAfter(cont);
		}

		// add button menus
		div.find('.quickhelp').each(build_button_menu);

		var link_new = $('<a/>')
			.attr('href', '#')
			.on('click', btn_add_callback);
		
		$('<span/>')
			.addClass('shortcut_key')
			.html('<i class="fa fa-plus"></i>')
			.appendTo(link_new);
			
		$('<span/>')
			.addClass('shortcut_descr')
			.text(': Add a new ' + mode + '-mode shortcut')
			.appendTo(link_new);

		$('<div/>')
			.addClass('col-xs-12 hidden-print quickhelp kse-links')
			.append(link_new)
			.appendTo(cont);

		// add the view-rebinds and add-a-new links
		if (params.kse_rebinds[mode].length > 0) {
			var link_view = link_new.clone()
				.off('click')
				.on('click', btn_view_callback)
				.appendTo(cont);
			link_view.find('.shortcut_key')
				.html('<i class="fa fa-eye"></i>');
			link_view.find('.shortcut_descr')
				.text(': View active ' + mode + '-mode shortcut edits');
			
			$('<div/>')
				.addClass('col-xs-12 hidden-print quickhelp kse-links')
				.append(link_view)
				.appendTo(cont);
		}

		return div;
	}

	return {
		'load_jupyter_extension': load_jupyter_extension,
		'load_ipython_extension': load_jupyter_extension
	};
});
