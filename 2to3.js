// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.
// Authors: @EWouters, @jfbercher and @jcb91
// Based on: https://github.com/jfbercher/code_prettify and
//           https://gist.github.com/takluyver/c8839593c615bb2f6e80

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Jupyter = require('base/js/namespace');
    var kernel_exec_on_cell = require('nbextensions/code_prettify/kernel_exec_on_cell')
    
    var mod_name = '2to3';
    var mod_log_prefix = '[' + mod_name + ']';

    // gives default settings
    var cfg = {
        add_toolbar_button: true,
        hotkey: 'Ctrl-M',
        process_all_hotkey: 'Ctrl-Shift-M',
        register_hotkey: true,
        show_alerts_for_errors: true,
        extension_name: '2to3',
        extension_label: 'Convert Python 2 to 3',
        extension_icon: 'fa-space-shuttle'
    };

    cfg.kernel_config_map = { // map of parameters for supported kernels
        "python": {
            "library": "import lib2to3, json\n\
from lib2to3.refactor import RefactoringTool, get_fixers_from_package\n\
avail_fixes = set(get_fixers_from_package('lib2to3.fixes'))\n\
refactoringTool = RefactoringTool(avail_fixes)\n\
del avail_fixes, get_fixers_from_package, RefactoringTool\n\
def refactor_cell(src):\n\
    try:\n\
        tree = refactoringTool.refactor_string(src+'\\n', '<dummy_name>')\n\
    except (lib2to3.pgen2.parse.ParseError,\n\
                lib2to3.pgen2.tokenize.TokenError):\n\
            return src \n\
    else:\n\
            return str(tree)[:-1]",
            "prefix": "print(json.dumps(refactor_cell(u",
            "postfix": ")))"
        }        
    };
    // set default json string, will later be updated from config
    // before it is parsed into an object
    cfg.kernel_config_map_json = JSON.stringify(cfg.kernel_config_map);

   function assign_hotkeys_from_config(cfg) {
       var cfg2to3 = cfg;
       var mod_edit_shortcuts = {};
       var mod_cmd_shortcuts = {};

       mod_edit_shortcuts[cfg.hotkey] = {
           help: "Reformat current cell from Python 2 to 3",
           help_index: 'yf',
           handler: function(evt) {
               return kernel_exec_on_cell.autoformat_cells(cfg2to3); },
       };

       mod_edit_shortcuts[cfg.process_all_hotkey] = {
           help: "Reformat the whole notebook from Python 2 to 3",
           help_index: 'yf',
           handler: function(evt) {
               return function() {
                   var indices = [];
                   var N = Jupyter.notebook.ncells();
                   for (var i = 0; i <= N; i++) {
                       indices.push(i);
                   }
                   kernel_exec_on_cell.autoformat_cells(cfg2to3, indices);
               }
           }(),
       };
       mod_cmd_shortcuts[cfg.process_all_hotkey] = mod_edit_shortcuts[cfg.process_all_hotkey]
       if (cfg.register_hotkey) {
           Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(mod_edit_shortcuts);
           Jupyter.keyboard_manager.command_shortcuts.add_shortcuts(mod_cmd_shortcuts);
       }
   }

    function load_notebook_extension () {
          console.log("Executing kernel_exec_on_cell load_ipython")
          kernel_exec_on_cell.main(mod_name, mod_log_prefix, cfg);
          //kernel_exec_on_cell.
            assign_hotkeys_from_config(kernel_exec_on_cell.bigCfg['2to3']); 
            }

    return {
        load_ipython_extension: load_notebook_extension
    };
});
