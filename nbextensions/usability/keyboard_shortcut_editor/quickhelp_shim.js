define([
	'underscore',
	'jquery',
	'base/js/utils',
	'notebook/js/quickhelp',
	'codemirror/lib/codemirror'
], function(
	_,
	$,
	utils,
	quickhelp,
	CodeMirror
){
	"use strict";
    // This is essentially a duplicate of the quickhelp module, used to
    // patch the existing quickhelp with definitions which aren't exported.

	var platform = utils.platform;

	var cmd_ctrl = 'Ctrl-';
	var platform_specific;

	if (platform === 'MacOS') {
		// Mac OS X specific
		cmd_ctrl = 'Cmd-';
		platform_specific = [
			{ shortcut: "Cmd-Up",     help:"go to cell start"  },
			{ shortcut: "Cmd-Down",   help:"go to cell end"  },
			{ shortcut: "Alt-Left",   help:"go one word left"  },
			{ shortcut: "Alt-Right",  help:"go one word right"  },
			{ shortcut: "Alt-Backspace",      help:"delete word before"  },
			{ shortcut: "Alt-Delete",         help:"delete word after"  },
		];
	} else {
		// PC specific
		platform_specific = [
			{ shortcut: "Ctrl-Home",  help:"go to cell start"  },
			{ shortcut: "Ctrl-Up",    help:"go to cell start"  },
			{ shortcut: "Ctrl-End",   help:"go to cell end"  },
			{ shortcut: "Ctrl-Down",  help:"go to cell end"  },
			{ shortcut: "Ctrl-Left",  help:"go one word left"  },
			{ shortcut: "Ctrl-Right", help:"go one word right"  },
			{ shortcut: "Ctrl-Backspace", help:"delete word before"  },
			{ shortcut: "Ctrl-Delete",	help:"delete word after"  },
		];
	}

	var cm_shortcuts = [
		{ shortcut:"Tab",   help:"code completion or indent" },
		{ shortcut:"Shift-Tab",   help:"tooltip" },
		{ shortcut: cmd_ctrl + "]",   help:"indent"  },
		{ shortcut: cmd_ctrl + "[",   help:"dedent"  },
		{ shortcut: cmd_ctrl + "a",   help:"select all"  },
		{ shortcut: cmd_ctrl + "z",   help:"undo"  },
		{ shortcut: cmd_ctrl + "Shift-z",   help:"redo"  },
		{ shortcut: cmd_ctrl + "y",   help:"redo"  },
	].concat( platform_specific );
	
	var mac_humanize_map = {
		// all these are unicode, will probably display badly on anything except macs.
		// these are the standard symbol that are used in MacOS native menus
		// cf http://apple.stackexchange.com/questions/55727/
		// for htmlentities and/or unicode value
		'cmd':'⌘',
		'shift':'⇧',
		'alt':'⌥',
		'up':'↑',
		'down':'↓',
		'left':'←',
		'right':'→',
		'eject':'⏏',
		'tab':'⇥',
		'backtab':'⇤',
		'capslock':'⇪',
		'esc':'esc',
		'ctrl':'⌃',
		'enter':'↩',
		'pageup':'⇞',
		'pagedown':'⇟',
		'home':'↖',
		'end':'↘',
		'altenter':'⌤',
		'space':'␣',
		'delete':'⌦',
		'backspace':'⌫',
		'apple':'',
	};

	var default_humanize_map = {
		'shift':'Shift',
		'alt':'Alt',
		'up':'Up',
		'down':'Down',
		'left':'Left',
		'right':'Right',
		'tab':'Tab',
		'capslock':'Caps Lock',
		'esc':'Esc',
		'ctrl':'Ctrl',
		'enter':'Enter',
		'pageup':'Page Up',
		'pagedown':'Page Down',
		'home':'Home',
		'end':'End',
		'space':'Space',
		'backspace':'Backspace',
		};
	
	var humanize_map;

	if (platform === 'MacOS'){
		humanize_map = mac_humanize_map;
	} else {
		humanize_map = default_humanize_map;
	}

	var special_case = { pageup: "PageUp", pagedown: "Page Down", 'minus': '-' };
	
	function humanize_key(key){
		if (key.length === 1){
			return key.toUpperCase();
		}

		key = humanize_map[key.toLowerCase()]||key;
		
		if (key.indexOf(',') === -1){
			return  ( special_case[key] ? special_case[key] : key.charAt(0).toUpperCase() + key.slice(1) );
		}
	}

	// return an **html** string of the keyboard shortcut
	// for human eyes consumption.
	// the sequence is a string, comma sepparated linkt of shortcut,
	// where the shortcut is a list of dash-joined keys.
	// Each shortcut will be wrapped in <kbd> tag, and joined by comma is in a
	// sequence.
	//
	// Depending on the platform each shortcut will be normalized, with or without dashes.
	// and replace with the corresponding unicode symbol for modifier if necessary.
	function humanize_sequence(sequence){
		var joinchar = ',';
		var hum = _.map(sequence.replace(/meta/g, 'cmd').split(','), humanize_shortcut).join(joinchar);
		return hum;
	}

	function humanize_shortcut(shortcut){
		var joinchar = '-';
		if (platform === 'MacOS'){
			joinchar = '';
		}
		var sh = _.map(shortcut.split('-'), humanize_key ).join(joinchar);
		return '<kbd>'+sh+'</kbd>';
	}
	
	var build_one = function (s) {
		var help = s.help;
		var shortcut = '';
		if(s.shortcut){
			shortcut = humanize_sequence(s.shortcut);
		}
		return $('<div>').addClass('quickhelp').
			append($('<span/>').addClass('shortcut_key').append($(shortcut))).
			append($('<span/>').addClass('shortcut_descr').text(' : ' + help));

	};

	var build_div = function (title, shortcuts) {
		
		// Remove jupyter-notebook:ignore shortcuts.
		shortcuts = shortcuts.filter(function(shortcut) {
			if (shortcut.help === 'ignore') {
				return false;
			} else {
				return true;
			}
		});
		
		var i, half, n;
		var div = $('<div/>').append($(title));
		var sub_div = $('<div/>').addClass('container-fluid');
		var col1 = $('<div/>').addClass('col-md-6');
		var col2 = $('<div/>').addClass('col-md-6');
		n = shortcuts.length;
		half = ~~(n/2);  // Truncate :)
		for (i=0; i<half; i++) { col1.append( build_one(shortcuts[i]) ); }
		for (i=half; i<n; i++) { col2.append( build_one(shortcuts[i]) ); }
		sub_div.append(col1).append(col2);
		div.append(sub_div);
		return div;
	};

    var quickhelp_shiv = {
        cmd_ctrl : cmd_ctrl,
        platform_specific : platform_specific,
        cm_shortcuts : cm_shortcuts,
        mac_humanize_map : mac_humanize_map,
        default_humanize_map : default_humanize_map,
        humanize_map : humanize_map,
        special_case : special_case,
        humanize_key : humanize_key,
        humanize_sequence : humanize_sequence,
        humanize_shortcut : humanize_shortcut,
        build_one : build_one,
        build_div : build_div
    };
	_.defaults(quickhelp, quickhelp_shiv);
});