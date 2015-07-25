define(['base/js/namespace'], function (IPython) {
    "use strict";
    var toggle_comments = {
        help    : 'Toggle comments',
        help_index : 'zz',
        handler : function (env) {
            var cm=env.notebook.get_selected_cell().code_mirror;
            var from = cm.getCursor("start"), to = cm.getCursor("end");
            cm.uncomment(from, to) || cm.lineComment(from, to);
            return false;
        }
    };

    var indent_selection = {
        help: 'Indent',
        help_index : 'zz',
        handler: function (env) {
            var cm=env.notebook.get_selected_cell().code_mirror;
            cm.execCommand('indentMore');
            return false;
        }
    };

    var dedent_selection = {
        help    : 'Indent less',
        help_index : 'zz',
        handler : function (env) {
            var cm = env.notebook.get_selected_cell().code_mirror;
            cm.execCommand('indentLess');
            return false;
        }
    };

  return {
    // this will be called at extension loading time
    //---
    load_ipython_extension: function (){
        IPython.keyboard_manager.actions.register(toggle_comments,'toggle_comments');
        IPython.keyboard_manager.actions.register(indent_selection,'indent_selection');
        IPython.keyboard_manager.actions.register(dedent_selection,'dedent_selection');
        IPython.keyboard_manager.edit_shortcuts.add_shortcut('Alt-3', 'auto.toggle_comments');
        IPython.keyboard_manager.edit_shortcuts.add_shortcut('Alt-2', 'auto.dedent_selection');
        IPython.keyboard_manager.edit_shortcuts.add_shortcut('Alt-1', 'auto.indent_selection');
        IPython.keyboard_manager.command_shortcuts.add_shortcut('Shift-k','ipython.move-selected-cell-up');
        IPython.keyboard_manager.command_shortcuts.add_shortcut('Shift-j','ipython.move-selected-cell-down');
        console.log("I have been loaded ! -- international_shortcuts");
    }
    //---
  };
});
