// add custom shortcuts

define([
    'base/js/namespace',
    'jquery'
], function(IPython, $) {
    "use strict";

    var add_command_shortcuts = {
            'esc' : {
                help    : 'edit mode',
                help_index : 'aa',
                handler : function() {
                    IPython.notebook.edit_mode();
                    return false;
                }
            },

            'home' : {
                help    : 'go to top',
                help_index : 'ga',
                handler : function() {
                    IPython.notebook.select(0);
                    IPython.notebook.scroll_to_top();
                    return false;
                }
            },

            'end' : {
                help    : 'go to bottom',
                help_index : 'ga',
                handler : function() {
                    var ncells = IPython.notebook.ncells();
                    IPython.notebook.select(ncells-1);
                    IPython.notebook.scroll_to_bottom();
                    return false;
                }
            },

            'pageup' : {
                help    : 'page up',
                help_index : 'aa',
                handler : function() {
                var wh = 0.6 * $(window).height();
                var cell = IPython.notebook.get_selected_cell();
                var h = 0;
                /* loop until we have enough cells to span the size of the notebook window (= one page) */
                do {
                    h += cell.element.height();
                    IPython.notebook.select_prev();
                    cell = IPython.notebook.get_selected_cell();
                } while ( h < wh );
                var cp = cell.element.position();
                var sp = $('body').scrollTop();
                if ( cp.top < sp) {
                    IPython.notebook.scroll_to_cell(IPython.notebook.get_selected_index(), 0);
                }
                cell.focus_cell();
                return false;
                }
            },

            'pagedown' : {
                help    : 'page down',
                help_index : 'aa',
                handler : function() {

                /* jump to bottom if we are already in the last cell */
                var ncells = IPython.notebook.ncells();
                if ( IPython.notebook.get_selected_index()+1 == ncells) {
                    IPython.notebook.scroll_to_bottom();
                    return false;
                }

                var wh = 0.6*$(window).height();
                var cell = IPython.notebook.get_selected_cell();
                var h = 0;

                /* loop until we have enough cells to span the size of the notebook window (= one page) */
                do {
                    h += cell.element.height();
                    IPython.notebook.select_next();
                    cell = IPython.notebook.get_selected_cell();
                } while ( h < wh );
                cell.focus_cell();
                return false;
                }
            },

            'shift-down': {
                help    : 'shift down',
                help_index : 'aa',
                handler : function() {
                    var index = IPython.notebook.get_selected_index();
                    if (index !== (IPython.notebook.ncells()-1) && index !== null) {
                        IPython.notebook.extend_selection('down');
                        IPython.notebook.focus_cell();
                    }
                return false;
                }
            },

            'shift-up': {
                help    : 'shift down',
                help_index : 'aa',
                handler : function() {
                    var index = IPython.notebook.get_selected_index();
                    if (index !== 0 && index !== null) {
                        IPython.notebook.extend_selection('up');
                        IPython.notebook.focus_cell();
                    }
                return false;
                }
            }

        };

    var add_edit_shortcuts = {
            'alt-add' : {
                help    : 'split cell',
                help_index : 'eb',
                handler : function() {
                    IPython.notebook.split_cell();
                    IPython.notebook.edit_mode();
                    return false;
                }
            },
            'alt-subtract' : {
                help    : 'merge cell',
                help_index : 'eb',
                handler : function() {
                    var i = IPython.notebook.get_selected_index();
                    if (i > 0) {
                        var l = IPython.notebook.get_cell(i-1).code_mirror.lineCount();
                        IPython.notebook.merge_cell_above();
                        IPython.notebook.get_selected_cell().code_mirror.setCursor(l,0);
                        }
                }
            },
            'shift-enter' : {
                help    : 'run cell, select next codecell',
                help_index : 'bb',
                handler : function() {
                    IPython.notebook.execute_cell_and_select_below();
                    var rendered = IPython.notebook.get_selected_cell().rendered;
                    var ccell = IPython.notebook.get_selected_cell().cell_type;
                    if (rendered === false || ccell === 'code') IPython.notebook.edit_mode();
                    return false;
                }
            },
            'ctrl-enter' : {
                help    : 'run cell',
                help_index : 'bb',
                handler : function() {
                    var cell = IPython.notebook.get_selected_cell();
                    var mode = cell.mode;
                    cell.execute();
                    if (mode === "edit") IPython.notebook.edit_mode();
                    return false;
                }
            },
            'alt-n' : {
                help    : 'toggle line numbers',
                help_index : 'xy',
                handler : function() {
                    var cell = IPython.notebook.get_selected_cell();
                    cell.toggle_line_numbers();
                    return false;
                }
            },
            'pagedown' : {
                help    : 'page down',
                help_index : 'xy',
                handler : function() {

                    var ic = IPython.notebook.get_selected_index();
                    var cells = IPython.notebook.get_cells();
                    var i, h=0;
                    for (i=0; i < ic; i ++) {
                        h += cells[i].element.height();
                        }
                    var cur = cells[ic].code_mirror.getCursor();
                    h += cells[ic].code_mirror.defaultTextHeight() * cur.line;
                    IPython.notebook.element.animate({scrollTop:h}, 0);
                    return false;
                }
            },
            'pageup' : {
                help    : 'page down',
                help_index : 'xy',
                handler : function() {

                    var ic = IPython.notebook.get_selected_index();
                    var cells = IPython.notebook.get_cells();
                    var i, h=0;
                    for (i=0; i < ic; i ++) {
                        h += cells[i].element.height();
                        }
                    var cur =cells[ic].code_mirror.getCursor();
                    h += cells[ic].code_mirror.defaultTextHeight() * cur.line;
                    IPython.notebook.element.animate({scrollTop:h}, 0);
                    return false;
                }
            },
            'ctrl-y' : {
                help : 'toggle markdown/code',
                handler : function() {
                    var cell = IPython.notebook.get_selected_cell();
                    var cur = cell.code_mirror.getCursor();
                    if (cell.cell_type == 'code') {
                        IPython.notebook.command_mode();
                        IPython.notebook.to_markdown();
                        IPython.notebook.edit_mode();
                        cell = IPython.notebook.get_selected_cell();
                        cell.code_mirror.setCursor(cur);
                    } else if (cell.cell_type == 'markdown') {
                        IPython.notebook.command_mode();
                        IPython.notebook.to_code();
                        IPython.notebook.edit_mode();
                        cell = IPython.notebook.get_selected_cell();
                        cell.code_mirror.setCursor(cur);
                    }
                    return false;
                }
            }
        };

    var load_ipython_extension = function() {
        IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
        IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_command_shortcuts);
    };
    var extension = {
        load_ipython_extension : load_ipython_extension
    };
    return extension;
});
