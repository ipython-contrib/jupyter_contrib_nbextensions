// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Hide or display solutions in a notebook

// december 30, 2015: update to notebook 4.1.x
// updated on december 22, 2015 to allow consecutive exercises
// exercise2: built by @jfbercher from an earlier work by @junasch october 2015) - see readme.md


    function show_solution() {
        var cell=IPython.notebook.get_selected_cell();
        var cell_index = IPython.notebook.get_selected_index();
        var ncells = IPython.notebook.ncells();
            cell.metadata.solution2 = "shown";
            IPython.notebook.select_next();       
            cell = IPython.notebook.get_selected_cell(); 
            while (cell_index++<ncells & cell.metadata.solution2 !=undefined & cell.metadata.solution2_first !=true) {
                cell.element.show();
                cell.metadata.solution2 = "shown";
                IPython.notebook.select_next();       
                cell = IPython.notebook.get_selected_cell();         
                }
        }

    function hide_solution() {
        var cell=IPython.notebook.get_selected_cell();
        var cell_index = IPython.notebook.get_selected_index();
        var ncells = IPython.notebook.ncells();
            cell.metadata.solution2 = "hidden";
            IPython.notebook.select_next();       
            cell = IPython.notebook.get_selected_cell(); 
            while (cell_index++<ncells & cell.metadata.solution2 !=undefined & cell.metadata.solution2_first !=true) {               
                cell.element.hide();
                cell.metadata.solution2 = "hidden";
                IPython.notebook.select_next();       
                cell = IPython.notebook.get_selected_cell();          
            }  
        }  



define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'nbextensions/rubberband/main'
], function(IPython, $, require, events, rubberband) {
    "use strict";

    var cbx=0; 
    /**
     * handle click event
     *
     * @method click_solution_lock
     * @param ev {Event} jquery event
    */





function ell(cbx) {
    var z =
'<div id=\"sol\" style=\"display:flex; width: 100%;   flex-direction:row; align-content: flex-end; \"> \
<div class=\"prompt\" >  \
</div> \
<div class=\"onoffswitch\" >\
<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\"  \
onclick="document.getElementById(\'myCheck' + cbx + '\').checked ? show_solution() : hide_solution()\" \
id=\"myCheck' + cbx + '\"  >\
<label class=\"onoffswitch-label\"  for=\"myCheck' + cbx + '\"> \
<div class=\"onoffswitch-inner\" ></div> \
<div class=\"onoffswitch-switch\"  ></div> \
</label> </div>\
</div>';
    return z
}


    /**
     * Hide solutions
     *
     * @method hide_solutions
     *
     */
     function process_solution() {
        var lcells=IPython.notebook.get_selected_cells();   //list of selected cells
        //var icells=IPython.notebook.get_selected_indices(); // corresponding indices
        if (typeof IPython.notebook.get_selected_indices == "undefined") { //noteboox 4.1.x
	         var icells=IPython.notebook.get_selected_cells_indices(); // corresponding indices 4.1.x version
        }
		else { //notebook 4.0.x
			var icells=IPython.notebook.get_selected_indices(); // corresponding indices
		}	

        // It is possible that no cell is selected
        if (lcells.length==0) {alert("Exercise extension:  \nPlease select some cells..."); return};

        var cell=lcells[0];
        var is_sol = cell.element.find('#sol').is('div');
        if  (is_sol === true) { //if is_sol then remove the solution
            cell.element.find('#sol').remove();
            delete cell.metadata.solution2_first;
            while (cell.metadata.solution2 != undefined & cell.metadata.solution2_first !=true) {
                delete cell.metadata.solution2;
                cell.element.show();
                IPython.notebook.select_next();
                cell = IPython.notebook.get_selected_cell()
            }
        } else {

                cell.element.css("flex-wrap","wrap")
                cell.element.append(ell(cbx++))
                cell.metadata.solution2_first =true;
                cell.metadata.solution2 = "hidden";
                cell.element.css({"background-color": "#ffffff"});
                for  (var k = 1; k < lcells.length; k++){
                    cell = lcells[k];
                    cell.element.css({"background-color": "#ffffff"});
                    cell.element.hide();
                    cell.metadata.solution2 = "hidden";
                }
                IPython.notebook.select(icells[0]);  //select first cell in the list
                }
        }
        
    IPython.toolbar.add_buttons_group([
            {
                id : 'process_solution',
                label : 'Exercise2: Create/Remove solution',
                icon : 'fa-toggle-on',
                callback : function () {
                    process_solution();
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
    
    /**
     * Display existing solutions at startup
     *
     */
    var cells = IPython.notebook.get_cells();
    var found_solution = false;
    for(var i in cells){
        var cell = cells[i];
        if (found_solution == true && typeof cell.metadata.solution2 != "undefined" && cell.metadata.solution2_first !=true) {
            if (cell.metadata.solution2  === "hidden") {
                        cell.element.hide();
               }
            else {
                cell.element.show();
            }
        } else {
            found_solution = false
        }
        //look for a solution just by testing if metadata solution2 exists
        if (found_solution == false && typeof cell.metadata.solution2 != "undefined") {
            cell.element.css("flex-wrap","wrap");
            cell.element.append(ell(cbx));             
            if (cell.metadata.solution2=="hidden") {               
                $('#myCheck'+cbx).prop('checked', false);
                cbx+=1;
            }
            else {
                $('#myCheck'+cbx).prop('checked', true);
                cbx+=1;
            }
            found_solution = true;
        }
    }
        // ***************** Keyboard shortcuts ******************************
var add_cmd_shortcuts = {
    'Alt-D': {
        help: 'Define solution (Exercise2)',
        help_index: 'ht',
        handler: function(event) {
            process_solution();
            return false;
        }
    }
}
IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_cmd_shortcuts);

function load_ipython_extension(){
    console.log("Executing rubberband load_ipython")
    rubberband.load_ipython_extension();
}


    return {
        load_ipython_extension: load_ipython_extension,
    };
    
});
