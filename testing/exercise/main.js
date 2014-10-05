// Hide or diplay solutions in a notebook

// To define a solution, mark all cells of a solution
// All cells will be hidden, execept the first one
// A unhide symbol will be displayed. Click on it and the solution will be displayed

"using strict";
define( function () {
    var load_ipython_extension = function () {

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
        var cell = IPython.notebook.get_selected_cell()
        if (typeof cell.metadata.solution != undefined && cell.metadata.solution == true) {
            // clear solution
            cell.element.find('#lock').removeClass('fa-plus-square-o')
            cell.element.find('#lock').removeClass('fa-minus-square-o')
            while (cell.metadata.solution == true) {
                delete cell.metadata.solution
                cell.element.show()
                IPython.notebook.select_next()
                cell = IPython.notebook.get_selected_cell()
            }
        } else {
            if (cell.metadata.marked == true) {
                var el = $('<div id="lock" class="fa fa-plus-square-o">')
                cell.element.prepend(el)
                cell.metadata.solution = true
                el.click(click_solution_lock)
               
                IPython.notebook.select_next();
                cell = IPython.notebook.get_selected_cell()
                while (cell.metadata.marked == true) {
                    cell.element.hide();
                    cell.metadata.solution = true
                    IPython.notebook.select_next();
                    cell = IPython.notebook.get_selected_cell()
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
     * Add gutter to new cell
     *
     * @method create_cell
     */
    create_cell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        var gutters = cell.code_mirror.getOption('gutters');
            var found = jQuery.inArray("CodeMirror-foldgutter", gutters);
            if ( found == -1) {
                cell.code_mirror.setOption('gutters', [ gutters , "CodeMirror-foldgutter"]);
            }            
    }

    /**
     * Add gutter to all existing cells
     */
    var cells = IPython.notebook.get_cells()
    var found_solution = false
    for(var i in cells){
        var cell = cells[i]
        var gutters = cell.code_mirror.getOption('gutters');
            var found = jQuery.inArray("CodeMirror-foldgutter", gutters);
            if ( found == -1) {
                cell.code_mirror.setOption('gutters', [ gutters , "CodeMirror-foldgutter"]);
            } 
        if (found_solution == true && typeof cell.metadata.solution != undefined && cell.metadata.solution  == true) {
            cell.element.hide()
        } else {
            found_solution = false
        }
        if (found_solution == false && typeof cell.metadata.solution != undefined && cell.metadata.solution == true) {
            // hide solution
            var el = $('<div id="lock" class="fa fa-plus-square-o">')
            cell.element.prepend(el)
            el.click( click_solution_lock)
            found_solution = true
        }
            
    }

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

//    load_css('/nbextensions/usability/solutions/main.css');
    load_css("/nbextensions/usability/codefolding/foldgutter.css");
    $([IPython.events]).on('create.Cell',create_cell);
    }
    
    return {
        load_ipython_extension : load_ipython_extension,
    };
});
