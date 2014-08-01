// add custom shortcuts

"using strict";

var add_command_shortcuts = {
        'esc' : {
            help    : 'edit mode',
            help_index : 'aa',
            handler : function (event) {
                IPython.notebook.edit_mode();
                return false;
            }
        }, 

        'home' : {
            help    : 'go to top',
            help_index : 'ga',
            handler : function (event) {
				IPython.notebook.select(0);
				IPython.notebook.scroll_to_top()
                return false;
            }
        }, 

        'end' : {
            help    : 'go to bottom',
            help_index : 'ga',
            handler : function (event) {
				var ncells = IPython.notebook.ncells();
				IPython.notebook.select(ncells-1);
				IPython.notebook.scroll_to_bottom()
				return false;
            }
        }, 

        'pageup' : {
            help    : 'page up',
            help_index : 'aa',
            handler : function (event) {
            var wh = 0.6 * $(window).height();
            var cell = IPython.notebook.get_selected_cell();
            var h = 0;
            /* loop until we have enough cells to span the size of the notebook window (= one page) */
            do {
                h += cell.element.height();
                IPython.notebook.select_prev();
                cell = IPython.notebook.get_selected_cell();
            } while ( h < wh )
			cell.focus_cell();
            return false;
            }
        }, 

		'pagedown' : {
            help    : 'page down',
            help_index : 'aa',
            handler : function (event) {

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
            } while ( h < wh )
			cell.focus_cell();
            return false;
            }
        }, 

        'ctrl-end' : {
            help    : 'run from current cell to end',
            help_index : 'xy',
            handler : function (event) {
                IPython.notebook.execute_cells_below();
                return false;
            }
        },
    };

IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_command_shortcuts);

var add_edit_shortcuts = {
        'Alt-add' : {
            help    : 'split cell',
            help_index : 'eb',
            handler : function (event) {
                IPython.notebook.split_cell();
                IPython.notebook.edit_mode();
                return false;
            }
        },
        'alt-subtract' : {
            help    : 'merge cell',
            help_index : 'eb',
            handler : function (event) {
                var i = IPython.notebook.get_selected_index();
                if (i > 0) {
                    var c = IPython.notebook.get_cell(i-1);
                    var l = c.code_mirror.lineCount();
                    IPython.notebook.merge_cell_above();
                    var c = IPython.notebook.get_selected_cell();
                    c.code_mirror.setCursor(l,0);
                    }
            }
        },       
        'shift-enter' : {
            help    : 'run cell, select next codecell',
            help_index : 'bb',
            handler : function (event) {
                var mode = IPython.notebook.get_selected_cell().mode;
                IPython.notebook.execute_cell_and_select_below();
                if (mode == "edit") IPython.notebook.edit_mode();
                return false;
            }
        },
        'ctrl-enter' : {
            help    : 'run cell',
            help_index : 'bb',
            handler : function (event) {
                var mode = IPython.notebook.get_selected_cell().mode;
                IPython.notebook.execute_cell();
                if (mode == "edit") IPython.notebook.edit_mode();
                return false;
            }
        },
        'ctrl-home' : {
            help    : 'go to top',
            help_index : 'ga',
            handler : function (event) {
				IPython.notebook.select(0);
				IPython.notebook.scroll_to_top()
                return false;
            }
        }, 

        'ctrl-end' : {
            help    : 'go to bottom',
            help_index : 'ga',
            handler : function (event) {
				var ncells = IPython.notebook.ncells();
				IPython.notebook.select(ncells-1);
				IPython.notebook.scroll_to_bottom()
				return false;
            }
        }, 
        'alt-n' : {
            help    : 'toggle line numbers',
            help_index : 'xy',
            handler : function (event) {
                var cell = IPython.notebook.get_selected_cell();
                cell.toggle_line_numbers();
                return false;
            }
        },

        'pagedown' : {
            help    : 'page down',
            help_index : 'xy',
            handler : function (event) {

                var ic = IPython.notebook.get_selected_index();
                var cells = IPython.notebook.get_cells();
                var i, h=0;
                for (i=0; i < ic; i ++) {
                    var cell=cells[i];
                    h += cell.element.height();
                    }
                var cell = cells[ic];
                var cur =cell.code_mirror.getCursor();
                h += cell.code_mirror.defaultTextHeight() * cur.line; 
                IPython.notebook.element.animate({scrollTop:h}, 0);                
                return false;
            }
        },
        'pageup' : {
            help    : 'page down',
            help_index : 'xy',
            handler : function (event) {

                var ic = IPython.notebook.get_selected_index();
                var cells = IPython.notebook.get_cells();
                var i, h=0;
                for (i=0; i < ic; i ++) {
                    var cell=cells[i];
                    h += cell.element.height();
                    }
                var cell = cells[ic];
                var cur =cell.code_mirror.getCursor();
                h += cell.code_mirror.defaultTextHeight() * cur.line; 
                IPython.notebook.element.animate({scrollTop:h}, 0);                
                return false;
            }
        },
        'ctrl-y' : {
            help : 'toggle markdown/code',
            handler : function (event) {
                var cell = IPython.notebook.get_selected_cell();
                if (cell.cell_type == 'code') {
                    var cur = cell.code_mirror.getCursor();
                    IPython.notebook.command_mode();
                    IPython.notebook.to_markdown();
                    IPython.notebook.edit_mode();
                    cell = IPython.notebook.get_selected_cell();
                    cell.code_mirror.setCursor(cur);            
                } else if (cell.cell_type == 'markdown') {
                    var cur = cell.code_mirror.getCursor();           
                    IPython.notebook.command_mode();
                    IPython.notebook.to_code();
                    IPython.notebook.edit_mode();
                    cell = IPython.notebook.get_selected_cell();
                    cell.code_mirror.setCursor(cur);            
                }
                return false;
            }
        },
	};

IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);


