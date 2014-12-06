// add new hotkey to toggle comments

"use strict";
var add_edit_shortcuts = {
        'Alt-c' : {
            help    : 'Toggle comments',
            help_index : 'eb',
            handler : function (event) {
                var cm=IPython.notebook.get_selected_cell().code_mirror
                var from = cm.getCursor("start"), to = cm.getCursor("end");
                cm.uncomment(from, to) || cm.lineComment(from, to);
                return false;
            }
        },
};
IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
