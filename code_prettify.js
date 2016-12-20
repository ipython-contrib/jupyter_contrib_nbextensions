// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.

define(function(require, exports, module) {
    'use strict';

    var Jupyter = require('base/js/namespace');
    var events = require('base/js/events');
    var utils = require('base/js/utils');
    var ConfigSection = require('services/config').ConfigSection;
    var CodeCell = require('notebook/js/codecell').CodeCell;

    var mod_name = 'code_prettify';
    var mod_log_prefix = '[' + mod_name + ']';
    var mod_edit_shortcuts = {};
    var replace_in_cell = false; //bool to enable/disable replacements
    var kernelLanguage; // language associated with kernel

    // gives default settings
    var cfg = {
        add_toolbar_button: true,
        hotkey: 'Ctrl-L',
        register_hotkey: true,
        show_alerts_for_errors: true,
    };

    var kMap = { // map of parameters for supported kernels
        python: {
            library: 'from yapf.yapflib.yapf_api import FormatCode',
            exec: yapf_format,
            post_exec: ''
        },
        r: { // intentionally in lower case
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

    function code_exec_callback(msg) {

        if (msg.msg_type == "error") {
            if (cfg.show_alerts_for_errors) {
                alert(mod_log_prefix, "Error:", msg.content.ename + "\n" + msg.content.evalue);
            }
            return
        }
        if (replace_in_cell) {
            if (kernelLanguage == "python") {
                var ret = msg.content.data['text/plain'];
                //console.log("RETURNED code", ret)
                var quote = String(ret[ret.length - 1])
                var reg = RegExp(quote + '[\\S\\s]*' + quote)
                var ret = String(ret).match(reg)[0] // extract text between quotes
                ret = ret.substr(1, ret.length - 2) //suppress quotes
                ret = ret.replace(/([^\\])\\n/g, "$1\n").replace(/([^\\])\\n/g, "$1\n")
                        // replace \n if not escaped (two times beacause of recovering subsequences)
                .replace(/([^\\])\\\\\\n/g, "$1\\\n") // [continuation line] replace \ at eol (but no conversion)
                    .replace(/\\'/g, "'") // replace simple quotes
                    .replace(/\\\\/g, "\\") // unescape
            }

            if (kernelLanguage == "r") {
                var ret = msg.content['text'];
                var ret = String(ret).replace(/\\"/gm, "'").replace(/\\n/gm, '\n').replace(/\$\!\$/gm, "\\n")
            }
            if (kernelLanguage == "javascript") {
                var ret = msg.content.data['text/plain'];
                var ret = String(ret).substr(1, ret.length - 1)
                    .replace(/\\'/gm, "'").replace(/\\n/gm, '\n').replace(/\$\!\$/gm, "\\n")
            }
            //yapf/formatR - cell (file) ends with a blank line. Here, still remove the last blank line
            var ret = ret.substr(0, ret.length - 1) //last blank line/quote char for javascript kernel
            var selected_cell = Jupyter.notebook.get_selected_cell();
            selected_cell.set_text(String(ret));
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

    function yapf_format() {
        var selected_cell = Jupyter.notebook.get_selected_cell();
        if (selected_cell instanceof CodeCell) {
            var text = selected_cell.get_text()
                .replace(/\\n/gm, "$!$") // Replace escaped \n by $!$
                .replace(/\"/gm, '\\"'); // Escape double quote
            var text = selected_cell.get_text()
            text = JSON.stringify(text)
                .replace(/([^\\])\\\\\\n/g, "$1") // [continuation line] replace \ at eol (but result will be on a single line)
            var code_input = 'FormatCode(' + text + ')[0]'
            //console.log("INPUT",code_input)
            exec_code(code_input)
        }
    }

    function autoFormat() {
        replace_in_cell = true;
        kMap[kernelLanguage].exec()
    }


    function add_toolbar_button () {
        if ($('#code_prettify_button').length < 1) {
            Jupyter.toolbar.add_buttons_group([{
                'label': 'Code prettify',
                'icon': 'fa-legal',
                'callback': autoFormat,
                'id': 'code_prettify_button'
            }]);
        }
    }

    function assign_hotkeys_from_config () {
        mod_edit_shortcuts[cfg.hotkey] = {
            help: "code prettify",
            help_index: 'yf',
            handler: autoFormat
        };
    }

    function setup_for_new_kernel () {
        kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase()
        var knownKernel = kMap[kernelLanguage]
        if (!knownKernel) {
            $('#code_prettify_button').remove()
            alert("Sorry; code prettify nbextension only works with a Python, R or javascript kernel");

        } else {
            if (cfg.add_toolbar_button) {
                add_toolbar_button();
            }
            if (cfg.register_hotkey) {
                Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(mod_edit_shortcuts);
            }
            replace_in_cell = false;
            exec_code(kMap[kernelLanguage].library)
        }
    }

    function load_notebook_extension () {
        var base_url = utils.get_body_data("baseUrl");
        var conf_section = new ConfigSection('notebook', {base_url: base_url});
        // first, load config
        conf_section.load()
        // now update default config with that loaded from server
        .then(function on_success (config_data) {
            $.extend(true, cfg, config_data[mod_name]);
        }, function on_error (err) {
            console.warn(mod_log_prefix, 'error loading config:', err);
        })
        // now do things which required the config to be loaded
        .then(function on_success () {
            assign_hotkeys_from_config(); // initialize hotkey
            // kernel may already have been loaded before we get here, in which
            // case we've missed the kernel_ready.Kernel event, so try this
            if (typeof Jupyter.notebook.kernel !== "undefined" && Jupyter.notebook.kernel != null) {
                setup_for_new_kernel();
            }

            // on kernel_ready.Kernel, a new kernel has been started
            events.on("kernel_ready.Kernel", function(event, data) {
                console.log(mod_log_prefix, 'restarting for new kernel_ready.Kernel event');
                setup_for_new_kernel();
            });
        });
    }

    return {
        load_ipython_extension: load_notebook_extension
    };
});
