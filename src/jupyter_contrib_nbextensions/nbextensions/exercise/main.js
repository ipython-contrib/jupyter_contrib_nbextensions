// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Hide or display solutions in a notebook

/*
December 30, 2015: update to 4.1
Update december 22, 2015:
  Added the metadata solution_first to mark the beginning of an exercise. It is now possible to have several consecutive exercises. 
Update october 21-27,2015: 
1- the extension now works with the multicell API, that is
   - several cells can be selected either via the rubberband extension
   - or via Shift-J (select next) or Shift-K (select previous) keyboard shortcuts
    (probably Shit-up and down will work in a near future) 
    Note: previously, the extension required the selected cells to be marked with a "selected" key in metadata. This is no more necessary with the new API.
Then clicking on the toolbar button transforms these cells into a "solution" which is hidden by default
** Do not forget to keep the Shift key pressed down while clicking on the menu button 
(otherwise selected cells will be lost)**
2- the "state" of solutions, hidden or shown, is saved and restored at reload/restart. We use the "solution" metadata to store the current state.
3- A small issue (infinite loop when a solution was defined at the bottom edge of the notebook have been corrected)
4- Added a keyboard shortcut (Alt-S) [S for solution]
*/

define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'nbextensions/rubberband/main'
], function(IPython, $, require, events, rubberband) {
    "use strict";

    /**
     * handle click event
     *
     * @method click_solution_lock
     * @param ev {Event} jquery event
    */
    function click_solution_lock(ev) {
        var cell=IPython.notebook.get_selected_cell();
    	var cell_index = IPython.notebook.get_selected_index();
        var ncells = IPython.notebook.ncells();
        var is_locked = cell.element.find('#lock').hasClass('fa-plus-square-o');
        if (is_locked == true) {
            cell.element.find('#lock').removeClass('fa-plus-square-o');
            cell.element.find('#lock').addClass('fa-minus-square-o');
            cell.metadata.solution = "shown";
            IPython.notebook.select_next();
            cell = IPython.notebook.get_selected_cell();
            while (cell_index++<ncells & cell.metadata.solution !=undefined & cell.metadata.solution_first !=true) {
                cell.element.show();
                cell.metadata.solution = "shown";
                IPython.notebook.select_next();
                cell = IPython.notebook.get_selected_cell();
            }
        } else {
            cell.element.find('#lock').removeClass('fa-minus-square-o');
            cell.element.find('#lock').addClass('fa-plus-square-o');
            cell.metadata.solution = "hidden"
            IPython.notebook.select_next();
            cell = IPython.notebook.get_selected_cell(); 
            while (cell_index++<ncells & cell.metadata.solution !=undefined & cell.metadata.solution_first !=true) {
                cell.element.hide();
                cell.metadata.solution = "hidden"
                IPython.notebook.select_next();
                cell = IPython.notebook.get_selected_cell();                
            }
        }
    } 

    /**
     * Hide solutions
     *
     * @method hide_solutions
     *
     */
     function hide_solutions() {
        // first check if lock symbol is already present in selected cell, if yes, remove it
        var lcells=IPython.notebook.get_selected_cells();   //list of selected cells
        if (typeof IPython.notebook.get_selected_indices == "undefined") { //noteboox 4.1.x
	         var icells=IPython.notebook.get_selected_cells_indices(); // corresponding indices 4.1.x version
        }
		else { //notebook 4.0.x
			var icells=IPython.notebook.get_selected_indices(); // corresponding indices
		}	
        // It is possible that no cell is selected
        if (lcells.length==0) {alert("Exercise extension:  \nPlease select some cells..."); return};

        var cell=lcells[0];
        var has_lock = cell.element.find('#lock').is('div');
        if  (has_lock === true) {
            cell.element.find('#lock').remove();
            delete cell.metadata.solution_first;
            while (cell.metadata.solution != undefined & cell.metadata.solution_first !=true ) {
                delete cell.metadata.solution;
                cell.element.show();
                IPython.notebook.select_next();
                cell = IPython.notebook.get_selected_cell()
            }
        } else {
/*(jfb) --- I do not understand this part... --- It looks for the first selected cell, but we already have the list of selected cells lcells
       // find first cell with solution
        var start_cell_i; // = undefined
        var cells = IPython.notebook.get_cells();
        for(var i in cells){
            var cell = cells[i];
            if (typeof cell.metadata.selected != undefined && cell.metadata.selected === true) {
                start_cell_i = i;
                console.log("selected start cell:", i);
                break
            }
        }
        IPython.notebook.select(start_cell_i);
*/
//            if (cell.metadata.selected == true) {   // (jfb) no metadata "selected"
                var el = $('<div id="lock" class="fa fa-plus-square-o">');
                cell.element.prepend(el);
                cell.metadata.solution_first=true;
                cell.metadata.solution = "hidden";
                cell.element.css({"background-color": "#ffffff"});
                el.click(click_solution_lock);
                for  (var k = 1; k < lcells.length; k++){
                    cell = lcells[k];
                    //console.log("new cell:", icells[k]);
                    cell.element.css({"background-color": "#ffffff"});
                    cell.element.hide();
                    cell.metadata.solution = "hidden";
                }
            }
            IPython.notebook.select(icells[0]);  //select first cell in the list    
        }
        
    IPython.toolbar.add_buttons_group([
            {
                id : 'hide_solutions',
                label : 'Exercise: Create/Remove solutions',
                icon : 'fa-mortar-board',
                callback : function () {
                    //console.log(IPython.notebook.get_selected_cells())
                    hide_solutions();
                    }
            }
         ]);

     /**
     * load css file and append to document
     *
     * @method load_css
     * @param name {String} filenaame of CSS file
     *
     */
    var load_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);
      };

    load_css('./main.css');
    var exercise_wrapper = $('<div id="dragmask" class="highlight-drag"></div>');
    $("#header").append(exercise_wrapper);

    // ***************** Keyboard shortcuts ******************************
    var add_cmd_shortcuts = {
        'Alt-S': {
            help: 'Define Solution (Exercise)',
            help_index: 'ht',
            handler: function(event) {
                hide_solutions();
                return false;
            }
        }
    }
    IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_cmd_shortcuts);
    
    /**
     * Display existing solutions at startup
     *
     */
    var cells = IPython.notebook.get_cells();
    var found_solution = false;
    for(var i in cells){
        var cell = cells[i];
        if (found_solution == true && typeof cell.metadata.solution != "undefined" && cell.metadata.solution_first !=true) {
            if (cell.metadata.solution  === "hidden") {
                            cell.element.hide() 
               }
            else {
                cell.element.show()
            }
        } else {
            found_solution = false
        }

        if (found_solution == false && typeof cell.metadata.solution != "undefined") {
            if (cell.metadata.solution=="hidden") var el = $('<div id="lock" class="fa fa-plus-square-o">');
            else var el = $('<div id="lock" class="fa fa-minus-square-o">');
            cell.element.prepend(el);
            el.click( click_solution_lock);
            found_solution = true;
        }
    }
    function load_ipython_extension(){
    console.log("Executing rubberband load_ipython")
    rubberband.load_ipython_extension();
}


    return {
        load_ipython_extension: load_ipython_extension,
    };
});
