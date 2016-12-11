// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.
// Author: Erik Wouters
// Based on: https://github.com/jfbercher/code_prettify and
//			 https://gist.github.com/takluyver/c8839593c615bb2f6e80

define(function(require, exports, module) {
    'use strict';

    var Jupyter = require('base/js/namespace');
    var keyboard = require('base/js/keyboard');
    var utils = require('base/js/utils');
    var configmod = require('services/config');
    var Cell = require('notebook/js/cell').Cell;
    var CodeCell = require('notebook/js/codecell').CodeCell;

    var add_edit_shortcuts = {};
    var exec_code_verbose = true;
    var kernelLanguage; // language associated with kernel

    var cfg = {
        hotkey: 'Ctrl-Q',
    }

    var convert_2to3_lib =
"\
import lib2to3 \n\
from lib2to3.refactor import RefactoringTool, get_fixers_from_package \n\
avail_fixes = set(get_fixers_from_package('lib2to3.fixes')) \n\
refactoringTool = RefactoringTool(avail_fixes) \n\
del avail_fixes, get_fixers_from_package, RefactoringTool \n\
def refactor_cell(src): \n\
    try: \n\
        tree = refactoringTool.refactor_string(src+'\\n', '<dummy_name>') \n\
    except (lib2to3.pgen2.parse.ParseError, \n\
            lib2to3.pgen2.tokenize.TokenError): \n\
        return src \n\
    else: \n\
        return str(tree)[:-1] \n\
"

    function initialize() {
        // create config object to load parameters
        var base_url = utils.get_body_data("baseUrl");
        var config = new configmod.ConfigSection('notebook', { base_url: base_url });
        config.load();
        config.loaded.then(function config_loaded_callback() {
            cfg = $.extend(true, cfg, config.data.conv2to3)
            convert_2to3_hotkey(); //initialize hotkey
        })
    }

	function code_exec_callback(msg) {
		if (msg.msg_type == "error") {
	        if (exec_code_verbose) alert("CODE 2to3 extension\n Error: " + msg.content.ename + "\n" + msg.content.evalue)
			return
		}
		var ret = msg.content.data['text/plain'];
		var ret = ret.substr(1, ret.length - 2) //suppress quotes 
		ret = ret.replace(/([^\\])\\n/g, "$1\n").replace(/([^\\])\\n/g, "$1\n") 
			.replace(/([^\\])\\\\\\n/g, "$1\\\n") // [continuation line] replace \ at eol -- probably useless in 2to3
			.replace(/\\'/g, "'") // replace simple quotes
			.replace(/\\\\/g, "\\") // unescape
		var selected_cell = Jupyter.notebook.get_selected_cell();
		selected_cell.set_text(String(ret));
	}

    function exec_code(code_input) {
        Jupyter.notebook.kernel.execute(code_input, { iopub: { output: code_exec_callback } }, { silent: false });
    }

	function convert_2to3(index) {
		Jupyter.notebook.select(index);
		var selected_cell = Jupyter.notebook.get_selected_cell();
		if (selected_cell instanceof CodeCell) {
			var text = selected_cell.get_text()
			text = JSON.stringify(text)    
			var code_input = 'refactor_cell(' + text + ')'
			exec_code(code_input, index)
		}
	}

    function autoConvert() {
        convert_2to3();
    }

    function convert_2to3_button() {
        if ($('#convert_2to3_button').length == 0) {
            Jupyter.toolbar.add_buttons_group([{
                'label': 'Convert current cell from Python 2 to 3',
                'icon': 'fa-space-shuttle',
                'callback': autoConvert,
                'id': 'convert_2to3_button'
            }]);
        }
    }

    function convert_2to3_hotkey() {
        add_edit_shortcuts[cfg['hotkey']] = {
            help: "Convert current cell from Python 2 to 3",
            help_index: 'yf',
            handler: autoConvert
        };
    }

    function getKernelInfos() {
        kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase()
        if (kernelLanguage != "python") {
            $('#convert_2to3_button').remove()
            //alert("Sorry; Convert 2to3 nbextension only works with a Python kernel");

        } else {
            convert_2to3_button();
            Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
            exec_code(convert_2to3_lib)
        }
    }

    function load_notebook_extension() {

        initialize();

        if (typeof Jupyter.notebook.kernel !== "undefined" && Jupyter.notebook.kernel != null) {
            getKernelInfos();
        }

        // only if kernel_ready (but kernel may be loaded before)
        $([Jupyter.events]).on("kernel_ready.Kernel", function() {
            console.log("convert_2to3: restarting")
            getKernelInfos();
        });
    }

    return {
        load_ipython_extension: load_notebook_extension
    };
});
