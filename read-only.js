//----------------------------------------------------------------------------
//  Copyright (C) 2008-2011  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// make codecell read-only

set_readOnly = function (cell,val) {
    if (val == undefined) {
        console.log("undefined");
        val = true;
    }
    cell.metadata.run_control.read_only = val;
    cell.read_only = val;
    var prompt = cell.element.find('div.input_area');
    if (val == true) {
        prompt.css("background-color","#ffffff"); 
        cell.code_mirror.setOption('readOnly',true);
    } else {
        prompt.css("background-color","#f5f5f5"); 
        cell.code_mirror.setOption('readOnly',false);
    }
};

/**
 * toogle read-only mode in codecell
 * 
 */
toggle_readOnly = function () {
    var cell = IPython.notebook.get_selected_cell();
    if ((cell instanceof IPython.CodeCell)) {
        if (cell.metadata.run_control == undefined){
            cell.metadata.run_control = {};    }
        set_readOnly(cell,!cell.metadata.run_control.read_only);
    }
};

/**
 * Add run control buttons to toolbar
 * 
 */
init_flowcontrol = function(){
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
            if (cell.metadata.run_control != undefined) {
                    set_readOnly(cell,cell.metadata.run_control.read_only);
            }
        }
    }   
};

$([IPython.events]).on('notebook_loaded.Notebook',init_flowcontrol);

console.log("Flowcontrol extension loaded correctly")
