
//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// ALT+S         - split cell
// ALT+A         - merge with cell above
// ALT+B         - merge with cell below
//============================================================================

"using strict";

var key   = IPython.utils.keycodes;

/**
 * Additional hotkeys for notebook
 *
 * @return {Boolean} return false to stop further key handling in notebook.js 
 */
var document_keydown = function(event) {
       
    if (event.which == 83 && event.altKey) { /* ALT-S */
    IPython.notebook.split_cell();
        return false;
    };
    
    if (event.which == 65 && event.altKey) { /* ALT-A */
    IPython.notebook.merge_cell_above();
        return false;
    };
    
    if (event.which == 66 && event.altKey) { /* ALT-B */
    IPython.notebook.merge_cell_below();
        return false;
    };
    
   return true;
};

/**
 * Register onKeyEvent to codemirror for all cells
 * and global keydown event
 *
 */            
init_keyevent = function(){
     IPython.toolbar.add_buttons_group([
                {
                    id : 'split_cell',
                    label : 'Split cell into two',
                    icon : 'icon-resize-vertical',
                    callback : function () {IPython.notebook.split_cell();}
                },
                {
                    id : 'merge_cell_above',
                    label : 'Merge with cell above',
                    icon : 'icon-level-down',
                    callback : function () {IPython.notebook.merge_cell_above();}
                },
                {
                    id : 'merge_cell_below',
                    label : 'Merge with cell below',
                    icon : 'icon-level-up',
                    callback : function () {IPython.notebook.merge_cell_below();}
                }
          ]);
     $(document).keydown( document_keydown );
};

$([IPython.events]).on('app_initialized.NotebookApp',init_keyevent);
console.log("Split-Combine extension loaded correctly")

