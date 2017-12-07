define([
	'require',
	'jquery',
	'base/js/events',
	'base/js/namespace',
	'notebook/js/textcell',
	'codemirror/lib/codemirror',
	'./typo/typo'
], function (
	requirejs,
	$,
	events,
	Jupyter,
	textcell,
	CodeMirror,
	Typo
) {
	'use strict';

	// parameters (potentially) stored in config. This object gets updated on config load.
	var params = {
		enable_on_load : true,
		add_toolbar_button : true,
		lang_code : 'en_US',
		dic_url : 'https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.dic',
		aff_url : 'https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.aff',
	};

	// Initialize data globally to reduce memory consumption
	var log_prefix = '[spellchecker]';
	var dict_load_promise;
	var typo_dict;

	/**
	 * Load the dictionaries from the param-specified urls
	 *
	 * @return {Promise} - a promise which fulfils when the dictionaries have
	 *                     been ajax-loaded
	 */
	function load_dictionary () {
		if (dict_load_promise === undefined) {
			dict_load_promise = Promise.all([
				params.aff_url ? $.ajax({
					url: requirejs.toUrl(params.aff_url),
					dataType: 'text'
				}) : Promise.resolve(''),
				params.dic_url ? $.ajax({
					url: requirejs.toUrl(params.dic_url),
					dataType: 'text'
				}) : Promise.resolve('')
			]).then(function (values) {
				if (typo_dict === undefined) {
					typo_dict = new Typo(params.lang_code, values[0], values[1], {
						platform: 'any'
					});
				}
				return typo_dict;
			});
		}
		return dict_load_promise;
	}

	/**
	 * rx_word_char defines characters in words,
	 * rx_non_word_char defines the opposite.
	 * Defining both allows a simplified mode token function.
	 * The single quote can be in words, as an apostrophe for contractions like
	 * "isn't", so it's treated as a word character, then stripped from the
	 * start & finish before checking the word against the dictionary.
	 */
	var rx_word_char     = /[^-\[\]{}():\/!;&@$£%§<>"*+=?.,~\\^|_`#±\s\t]/;
	var rx_non_word_char =  /[-\[\]{}():\/!;&@$£%§<>"*+=?.,~\\^|_`#±\s\t]/;

	function define_mode (original_mode_spec) {
		if (original_mode_spec.indexOf('spellcheck_') === 0) {
			return original_mode_spec;
		}

		var new_mode_spec = 'spellcheck_' + original_mode_spec;
		CodeMirror.defineMode(new_mode_spec, function (config) {
			var spellchecker_overlay = {
				name: new_mode_spec,
				token: function (stream, state) {
					if (stream.eatWhile(rx_word_char)) {
						// strip leading and trailing single quotes
						var word = stream.current().replace(/(^')|('$)/g, '');
						// we don't consider a set of digits as a word to spellcheck
						if (!word.match(/^\d+$/) && (typo_dict !== undefined) && !typo_dict.check(word)) {
							return 'spell-error';
						}
					}
					stream.eatWhile(rx_non_word_char);
					return null;
				}
			};
			return CodeMirror.overlayMode(
				CodeMirror.getMode(config, original_mode_spec), spellchecker_overlay, true);
		});
		return new_mode_spec;
	}

	/**
	 * Given a codemirror mode specification string, return the corresponding
	 * string with spellcheck enabled/disabled by adding/removing 'spellcheck_'
	 * from the beginning where necessary
	 *
	 * @param {String} mode - a CodeMirror mode specification string
	 * @param {Boolean} spellcheck_on - whether a spellcheck mode should be returned
	 * @return {String} - the appropriate CodeMirror mode string
	 */
	function toggle_mode (mode, spellcheck_on) {
		var new_mode = mode.substr(Boolean(mode.match('^spellcheck_')) ? 11 : 0);
		if (spellcheck_on) {
			return define_mode(new_mode);
		}
		else {
			return new_mode;
		}
	}

	/**
	 * Toggle spelling checking overlay usage for all text cells
	 *
	 * @param {Boolean} set_on - whether spellcheck mode should be toggled on.
	 *     If undefined, it's just toggled from current state
	 * @return {Boolean} - whether the mode was set on
	 */
	function toggle_spellcheck (set_on) {
		set_on = (set_on !== undefined) ? set_on : (params.enable_on_load = !params.enable_on_load);
		// Change defaults for new cells:
		textcell.MarkdownCell.options_default.cm_config.mode = toggle_mode(
			textcell.MarkdownCell.options_default.cm_config.mode, set_on
		);
		// And change any existing cells:
		Jupyter.notebook.get_cells().forEach(function (cell, idx, array) {
			if (cell instanceof textcell.TextCell) {
				var new_mode = toggle_mode(cell.code_mirror.getOption('mode'), set_on);
				cell.code_mirror.setOption('mode', new_mode);
			}
		});
		// update button class
		$('#spellchecker_btn').toggleClass('active', set_on);
		console.log(log_prefix, 'toggled ' + (set_on ? 'on' : 'off'));
		return set_on;
	}

	/**
	 * Add a button to the jupyter toolbar for toggling spellcheck overlay
	 */
	function add_toolbar_buttons () {
		return $(Jupyter.toolbar.add_buttons_group([
			Jupyter.keyboard_manager.actions.register ({
				help   : 'Toggle spell checking on markdown cells',
				icon   : 'fa-check',
				handler: function (evt) {
					toggle_spellcheck();
					setTimeout(function () {
						evt.currentTarget.blur();
					}, 100);
				}
		    }, 'toggle-spellchecking', 'spellchecker')
		])).find('.btn').attr('id', 'spellchecker_btn');
	}

	/**
	 * Add a <link> for a css file to the document head
	 *
	 * @param {String} url - the url of the css file, which will be passed
	 *      through requirejs.toUrl, to enable relative urls
	 * @return {jQuery} - a jQuery object containing the link which was added
	 */
	function add_css (url) {
		return $('<link/>').attr({
			type : 'text/css',
			rel : 'stylesheet',
			href : requirejs.toUrl(url)
		}).appendTo('head');
	}

	/**
	 * Initializes the extension
	 */
	function load_jupyter_extension () {
		add_css('./main.css');

		return Jupyter.notebook.config.loaded
			.then(function () {
				$.extend(true, params, Jupyter.notebook.config.data.spellchecker); // update params
				if (params.add_toolbar_button) {
					add_toolbar_buttons();
				}
				toggle_spellcheck(params.enable_on_load);
			})
			.then(load_dictionary);
	}

	return {
		load_jupyter_extension : load_jupyter_extension,
		load_ipython_extension : load_jupyter_extension,
	};
});
