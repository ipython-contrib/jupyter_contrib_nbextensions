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
    var add_edit_shortcuts = {}
    var cfg = {yapf_hotkey:'Ctrl-L'}

    var kMap = { //for later use
        python2: {library: 'from yapf.yapflib.yapf_api import FormatCode', 
        exec: yapf_format, post_exec:''},
        python3: {library: 'from yapf.yapflib.yapf_api import FormatCode', 
        exec: yapf_format, post_exec:''}
    }

    function initialize() {
        // create config object to load parameters
        var base_url = utils.get_body_data("baseUrl");
        var config = new configmod.ConfigSection('notebook', { base_url: base_url });
        config.load();
        config.loaded.then(function config_loaded_callback() {
            // config may be specified at system level or at document level.
            // first, update defaults with config loaded from server
            for (var key in cfg) {
                if (config.data.hasOwnProperty(key)) {
                    cfg[key] = config.data[key];
                }
            }
            yapf_hotkey();
        })
    }


    function code_exec_callback(msg) {
        if(msg.msg_type=="error"){
            alert("Error in code: "+msg.content.ename+"\n"+msg.content.evalue)
            return
        }
        var ret = msg.content.data['text/plain'];
        var ret = String(ret).substr(1, ret.length - 2).replace(/\\n/gm, '\n')
        //yapf - cell (file) ends with a blank line. Here, still remove the last blank line
        var ret = ret.substr(0, ret.length - 1) 
        var cell = Jupyter.notebook.get_selected_cell();
        cell.set_text(ret);
    }

    function exec_code(code_input) {
        Jupyter.notebook.kernel.execute(code_input, { iopub: { output: code_exec_callback } }, { silent: false });
    }

    function yapf_format() {
        var cell = Jupyter.notebook.get_selected_cell();
        if (cell instanceof CodeCell) {
            var text = cell.get_text()
            var code_input = 'FormatCode("""' + text + '""")[0]'
            exec_code(code_input)
        }
    }

    function yapf_button() {
        if ($('#yapf_button').length == 0) {
            Jupyter.toolbar.add_buttons_group([{
                'label': 'Yapf formatting',
                'icon': 'fa-legal',
                'callback': yapf_format,
                'id': 'yapf_button'
            }]);
        }
    }

    function yapf_hotkey() {
        add_edit_shortcuts[cfg['yapf_hotkey']] = {
            help: "yapf formatting",
            help_index: 'yf',
            handler: yapf_format
        }
    }


    function load_notebook_extension() {

        initialize();
        if (typeof Jupyter.notebook.kernel !== "undefined" && Jupyter.notebook.kernel != null) {
            var IPythonKernel = (Jupyter.notebook.kernel.name == "python2" || Jupyter.notebook.kernel.name == "python3")
            if (IPythonKernel) {
                Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
                yapf_button();
                exec_code("from yapf.yapflib.yapf_api import FormatCode")
            }
        }

        // only if kernel_ready (but kernel may be loaded before)
        $([Jupyter.events]).on("kernel_ready.Kernel", function() {
            console.log("kernel_ready.Kernel")
                // If kernel has been restarted, or changed, 
            var IPythonKernel = (Jupyter.notebook.kernel.name == "python2" || Jupyter.notebook.kernel.name == "python3")
            if (!IPythonKernel) {
                $('#yapf_button').remove()
                alert("Sorry; yapf nbextension only works with a IPython kernel");

            } else {
                yapf_button();
                Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
                console.log("yapf_ext: restarting")
                exec_code("from yapf.yapflib.yapf_api import FormatCode")
            }
        });
    }

    return {
        load_ipython_extension: load_notebook_extension
    };
});
