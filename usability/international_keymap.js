"use strict";

define(function(){
  return {
    // this will be called at extension loading time
    //---
    load_ipython_extension: function(){
        console.log("I have been loaded ! -- international_keymap");
    }
    //---
  };
})


var add_edit_shortcuts = {
        'Alt-3' : {
            help    : 'Toggle comments',
            help_index : 'zz',
            handler : function () {
                var cm=IPython.notebook.get_selected_cell().code_mirror;
                var from = cm.getCursor("start"), to = cm.getCursor("end");
                cm.uncomment(from, to) || cm.lineComment(from, to);
                return false;
            }
        },

        'Alt-1' : {
            help: 'Indent',
            help_index : 'zz',
            handler: function() {
                var cm=IPython.notebook.get_selected_cell().code_mirror;
                cm.execCommand('indentMore');
                return false;
            }
        },

        'Alt-2' : {
            help    : 'indent less',
            help_index : 'zz',
            handler : function () {
                var cm = IPython.notebook.get_selected_cell().code_mirror;
                cm.execCommand('indentLess');
                return false;
            }
        },
    };

IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
IPython.keyboard_manager.command_shortcuts.add_shortcut('Shift-k','ipython.move-selected-cell-up')
IPython.keyboard_manager.command_shortcuts.add_shortcut('Shift-j','ipython.move-selected-cell-down')
