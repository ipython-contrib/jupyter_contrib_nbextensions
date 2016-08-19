// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.

define(function(require, exports, module) {
    'use strict';

    var Jupyter = require('base/js/namespace');
    var keyboard = require('base/js/keyboard');
    var utils = require('base/js/utils');
    var configmod = require('services/config');
    var Cell = require('notebook/js/cell').Cell;
    var CodeCell = require('notebook/js/codecell').CodeCell;

    var add_edit_shortcuts = {};
    var replace_in_cell = false; //bool to enable/disable replacements 
    var exec_code_verbose = true;
    var kName; // name of current kernel
    var kernelLanguage; // language associated with kernel

    var cfg = {
        code_format_hotkey: 'Ctrl-L',
    }

    var kLang = { // map of languages associated with kernels names
        python2: 'python',
        python3: 'python',
        ir: 'R',
        ir32: 'R',
        ir33: 'R',
        conda_r_envname: 'R', //?
        javascript: 'javascript',
    }

    var kMap = { // map of parameters for supported kernels
        python: {
            library: 'from yapf.yapflib.yapf_api import FormatCode',
            exec: yapf_format,
            post_exec: ''
        },
        R: {
            library: 'library(formatR)',
            exec: autoR_format,
            post_exec: ''
        },
        javascript: {
            library: String('var beautify' + ' = require' + '("js-beautify").js_beautify'),
            exec: js_beautify,
            post_exec: ''
        },
    }


    function initialize() {
        // create config object to load parameters
        var base_url = utils.get_body_data("baseUrl");
        var config = new configmod.ConfigSection('notebook', { base_url: base_url });
        config.load();
        config.loaded.then(function config_loaded_callback() {
            for (var key in cfg) {
                if (config.data.hasOwnProperty(key)) {
                    cfg[key] = config.data[key];
                }
            }
            code_format_hotkey(); //initialize hotkey
        })
    }

    function code_exec_callback(msg) {

        if (msg.msg_type == "error") {
            if (exec_code_verbose) alert("CODE prettify extension\n Error: " + msg.content.ename + "\n" + msg.content.evalue)
            return
        }
        if (replace_in_cell) {
            if (kernelLanguage == "python") {
                var ret = msg.content.data['text/plain'];
                var ret = String(ret).substr(1, ret.length - 2)
                    .replace(/\\'/gm, "'") // unescape simple quotes
                    .replace(/\\\\'/gm, "\\'") // remaining escaped simple quotes
                    .replace(/\$\!2\$/gm, '\\"') // replace $!2$ by \"
            }
            if (kernelLanguage == "R") {
                var ret = msg.content['text'];
                var ret = String(ret).replace(/\\"/gm, "'")
            }
            if (kernelLanguage == "javascript") {
                var ret = msg.content.data['text/plain'];
                var ret = String(ret).substr(1, ret.length - 1)
                    .replace(/\\'/gm, "'")
            }
            //yapf/formatR - cell (file) ends with a blank line. Here, still remove the last blank line
            var ret = ret.replace(/\\n/gm, '\n').replace(/\$\!\$/gm, "\\n")
            var ret = ret.substr(0, ret.length - 1) //last blank line/quote char for javascript kernel
            var selected_cell = Jupyter.notebook.get_selected_cell();
            selected_cell.set_text(ret);
        }
    }


    function exec_code(code_input) {
        Jupyter.notebook.kernel.execute(code_input, { iopub: { output: code_exec_callback } }, { silent: false });
    }


    function js_beautify() {
        var selected_cell = Jupyter.notebook.get_selected_cell();
        if (selected_cell instanceof CodeCell) {
            var text = selected_cell.get_text().replace(/\\n/gm, "$!$")
                .replace(/\n/gm, "\\n")
                .replace(/\'/gm, "\\'")
            var code_input = "beautify(text='" + text + "')"
            exec_code(code_input)
        }
    }

    function autoR_format() {
        var selected_cell = Jupyter.notebook.get_selected_cell();
        if (selected_cell instanceof CodeCell) {
            var text = selected_cell.get_text().replace(/\\n/gm, "$!$")
                .replace(/\'/gm, "\\'").replace(/\\"/gm, "\\'")
            var code_input = "tidy_source(text='" + text + "')"
            exec_code(code_input)
        }
    }

    function yapf_format(index) {
        //var selected_cell = Jupyter.notebook.get_selected_cell();
        index = index;
        Jupyter.notebook.select(index);
        var selected_cell = Jupyter.notebook.get_selected_cell();
        if (selected_cell instanceof CodeCell) {
            var text = selected_cell.get_text()
                .replace(/\\n/gm, "$!$") // Replace escaped \n by $!$
                .replace(/\\"/gm, '$!2$') // replace escaped " by $!2$
                .replace(/\"/gm, '\\"'); // Escape double quote
            var code_input = 'FormatCode("""' + text + '""")[0]'
            exec_code(code_input, index)
        }
    }

    function autoFormat() {
        replace_in_cell = true;
        kMap[kernelLanguage].exec()
    }


    function code_format_button() {
        if ($('#code_format_button').length == 0) {
            Jupyter.toolbar.add_buttons_group([{
                'label': 'Code formatting',
                'icon': 'fa-legal',
                'callback': autoFormat,
                'id': 'code_format_button'
            }]);
        }
    }

    function code_format_hotkey() {
        add_edit_shortcuts[cfg['code_format_hotkey']] = {
            help: "code formatting",
            help_index: 'yf',
            handler: autoFormat
        };
    }


    function load_notebook_extension() {

        initialize();

        if (typeof Jupyter.notebook.kernel !== "undefined" && Jupyter.notebook.kernel != null) {
            kName = Jupyter.notebook.kernel.name;
            kernelLanguage = kLang[kName]
            if (kernelLanguage) {
                Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
                code_format_button();
                replace_in_cell = false;
                exec_code(kMap[kernelLanguage].library)
            }
        }

        // only if kernel_ready (but kernel may be loaded before)
        $([Jupyter.events]).on("kernel_ready.Kernel", function() {
            console.log("kernel_ready.Kernel")
                // If kernel has been restarted, or changed, 
            kName = Jupyter.notebook.kernel.name;
            kernelLanguage = kLang[kName];
            if (!kernelLanguage) {
                $('#code_format_button').remove()
                alert("Sorry; code prettify nbextension only works with a Python, R or javascript kernel");

            } else {
                code_format_button();
                Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
                console.log("code_prettify: restarting")
                replace_in_cell = false;
                exec_code(kMap[kernelLanguage].library)
            }
        });
    }

    return {
        load_ipython_extension: load_notebook_extension
    };
});
