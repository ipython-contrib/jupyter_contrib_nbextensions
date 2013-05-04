//----------------------------------------------------------------------------
//  Copyright (C) 2008-2011  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// make codecell read-only

/**
 * toogle read-only mode in codecell
 * 
 */
var toggle_readOnly = function () {
    var cell = IPython.notebook.get_selected_cell();
    if ((cell instanceof IPython.CodeCell)) {
        cell.read_only = !cell.read_only;
        var prompt = cell.element.find('div.input_area');
        if (cell.read_only == true) {
            prompt.css("background-color","#ffffff"); 
            cell.code_mirror.setOption('readOnly',true);
        } else {
            prompt.css("background-color","#f5f5f5"); 
            cell.code_mirror.setOption('readOnly',false);
        }
    }
};

/**
 * Add run control buttons to toolbar
 * 
 */
var init_flowcontrol = function(){
    IPython.toolbar.add_buttons_group([
                {
                    id : 'run_c',
                    label : 'Toggle Disable Cell',
                    icon : 'ui-icon-seek-next',
                    callback : toggle_readOnly
                }
          ]);
          
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) {
            if (cell.read_only == true) {
                var prompt = cell.element.find('div.input_area');
                prompt.css("background-color","#ffffff"); 
            }
        }
    }   
};

$([IPython.events]).on('notebook_loaded.Notebook',init_flowcontrol);

console.log("Flowcontrol extension loaded correctly")
