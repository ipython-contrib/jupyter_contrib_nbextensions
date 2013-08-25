// Adds a button to hide all cells below the selected heading

(function (IPython) {
  "use strict";

  /**
   * Return the level of nbcell.
   *
   * @param {Object} cell notebook cell
   */
  var get_cell_level = function (cell) {

    if ( cell.cell_type === "heading" ) {
      return cell.level;
    } else {
      // headings can have a level upto 6
      // therefore 7 is returned
      return 7;
    }

  }


  /**
   * Hide/reveal all cells in the section headed by cell.
   *
   * @param {Object} cell notebook cell
   */
  var toggle_heading = function (cell) {

    var index = cell.element.index() + 1;
    var section_level = get_cell_level( cell );

    // Check if we have to start iterating over the
    // notebook cells
    var current_cell = IPython.notebook.get_cell( index );
    var cell_level = get_cell_level( current_cell );

    while( cell_level > section_level ) {
      // Hide the current cell
      current_cell.element.slideToggle();
      // Proceed to the next cell
      index++;
      current_cell = IPython.notebook.get_cell( index );
      if( current_cell === null )
        break;
      cell_level = get_cell_level( current_cell );
    }

  };


  var init_toggle_heading = function(){

    // Add a button to the toolbar
    IPython.toolbar.add_buttons_group([{
      label:'toggle heading',
      icon:'icon-double-angle-up',
      callback: function () { 
        var cell = IPython.notebook.get_selected_cell()
        toggle_heading( cell );

        // Mark as collapsed
        if ( cell.metadata.heading_collapsed ) {
          cell.metadata.heading_collapsed = false;
        } else {
          cell.metadata.heading_collapsed = true;
        }
      }
    }]);

    // toggle all cells that are marked as collapsed
    var cells = IPython.notebook.get_cells();
    cells.forEach( function(cell){
      if( cell.metadata.heading_collapsed ){
        toggle_heading(cell)
      }
    }
    );

    // Write a message to the console to confirm the extension loaded
    console.log("hierarchical_collapse notebook extension loaded correctly");

    return true;
  }


  // The following line somehow does not work,
  // i.e. init_hide_input never gets called.
  //$([IPython.events]).on('notebook_loaded.Notebook', init_toggle_heading);
  // work-around:
  init_toggle_heading();

}(IPython));
