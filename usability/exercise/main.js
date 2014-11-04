// Hide or diplay solutions in a notebook

// To define a solution, select all cells of a solution using shift button and mouse
// All cells will be hidden, except the first one
// A hide/unhide symbol will be displayed. Click on it and the solution will be displayed/hidden

define([
    'base/js/namespace',
    'jquery',
    "base/js/events",
], function(IPython, $, events) {
    "use strict";

    /**
     * handle click event
     *
     * @method click_solution_lock
     * @param ev {Event} jquery event
    */
    function click_solution_lock(ev) {
        var cell=IPython.notebook.get_selected_cell()
        var is_locked = cell.element.find('#lock').hasClass('fa-plus-square-o')
        if (is_locked == true) {
            cell.element.find('#lock').removeClass('fa-plus-square-o')
            cell.element.find('#lock').addClass('fa-minus-square-o')
            while (cell.metadata.solution == true) {
                IPython.notebook.select_next();
                cell.element.show();
                cell = IPython.notebook.get_selected_cell()
            }
        } else {
            cell.element.find('#lock').removeClass('fa-minus-square-o')
            cell.element.find('#lock').addClass('fa-plus-square-o')
            IPython.notebook.select_next();
            cell = IPython.notebook.get_selected_cell()                          
            while (cell.metadata.solution == true) {
                cell.element.hide();
                IPython.notebook.select_next();
                cell = IPython.notebook.get_selected_cell()                
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
        var cell=IPython.notebook.get_selected_cell()
        var has_lock = cell.element.find('#lock').is('div')
        if  (has_lock === true) {
            cell.element.find('#lock').remove()
            while (cell.metadata.solution == true) {
                delete cell.metadata.solution
                cell.element.show()
                IPython.notebook.select_next()
                cell = IPython.notebook.get_selected_cell()
            }
        } else {
       // find first cell with solution
        var start_cell_i // = undefined
        var cells = IPython.notebook.get_cells()
        for(var i in cells){
            var cell = cells[i]
            if (typeof cell.metadata.selected != undefined && cell.metadata.selected === true) {
                start_cell_i = i
                console.log("selected start cell:",i)
                break
            }
        }
        IPython.notebook.select(start_cell_i)
            if (cell.metadata.selected == true) {
                var el = $('<div id="lock" class="fa fa-plus-square-o">')
                cell.element.prepend(el)
                cell.metadata.solution = true
                cell.element.css({"background-color": "#ffffff"});
                delete cell.metadata.selected

                el.click(click_solution_lock)
               
                IPython.notebook.select_next();
                cell = IPython.notebook.get_selected_cell()
                console.log("new cell:", IPython.notebook.get_selected_index())
                while (cell.metadata.selected == true) {
                    cell.element.css({"background-color": "#ffffff"});
                    delete cell.metadata.selected
                    cell.element.hide();
                    cell.metadata.solution = true
                    IPython.notebook.select_next();
                    cell = IPython.notebook.get_selected_cell()
                    console.log("new cell(i):",IPython.notebook.get_selected_index())
                }
            }
        }
    }
        
    IPython.toolbar.add_buttons_group([
            {
                id : 'hide_solutions',
                label : 'Hide solution',
                icon : 'fa-mortar-board',
                callback : function () {
                    hide_solutions();
                    }
            },
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
        console.log(link);
        document.getElementsByTagName("head")[0].appendChild(link);
      };

    load_css('/nbextensions/testing/exercise/main.css');
    var exercise_wrapper = $('<div id="dragmask" class="highlight-drag"></div>')
    $("#header").append(exercise_wrapper)
    
    /**
     * Display existing solutions at startup
     *
     */
    var cells = IPython.notebook.get_cells()
    var found_solution = false
    for(var i in cells){
        var cell = cells[i]
        if (found_solution == true && typeof cell.metadata.solution != undefined && cell.metadata.solution  === true) {
            cell.element.hide()
        } else {
            found_solution = false
        }
        if (found_solution == false && typeof cell.metadata.solution != undefined && cell.metadata.solution === true) {
            // hide solution
            var el = $('<div id="lock" class="fa fa-plus-square-o">')
            cell.element.prepend(el)
            el.click( click_solution_lock)
            found_solution = true
        }
    }
})
