// map shift-tab to "indentLess" command in codemirror

"use strict";
var add_edit_shortcuts = {
        'Shift-tab' : {
            help    : 'indent less',
            help_index : 'eb',
            handler : function (event) {
                console.log("shift-tab")
                var cell = IPython.notebook.get_selected_cell();
                cell.code_mirror.execCommand('indentLess')
                return false;
         }
     },
};

IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
