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
   * Find the closest heading cell above the currently
   * selected cell which is not yet collapsed. If the
   * currently selected cell is a heading cell, no
   * new cell is sought for.
   */
  var find_toggleable_cell = function () {

    // Get selected cell
    var cell = IPython.notebook.get_selected_cell();

    // If the current cell is a heading cell return
    if ( cell.cell_type === "heading" ) {
      return cell;
    } else {
      // Find a heading cell that is not yet collapsed
      var index = IPython.notebook.get_selected_index();
      var is_collapsable = ( (cell.cell_type === "heading") && cell.metadata.heading_collapsed !== true );

      while( index > 0 && !is_collapsable ) {
        index--;
        cell = IPython.notebook.get_cell( index );
        is_collapsable = ( (cell.cell_type === "heading") && cell.metadata.heading_collapsed !== true );
      }
      if( index === 0 && !is_collapsable ) {
        // No candidate was found, return the current cell
        return IPython.notebook.get_selected_cell();
      } else {
        // select his cell and return
        IPython.notebook.select(index);
        return cell;
      }
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

    var enable_toggle = true;
    var switch_heading_level = 6;

    while( cell_level > section_level ) {

      // Hide/reveal regular cells until a heading is found that is collapsed/revealed
      // then stop collapsing/revealing until a new heading is found of that level
      if( cell_level <= switch_heading_level ) {
        if( current_cell.metadata.heading_collapsed === true ) {
          enable_toggle = false;
          // do toggle the heading
          current_cell.element.slideToggle();
          // mark the next level from which we can update enable_toggle
          switch_heading_level = get_cell_level( current_cell );
        } else {
          enable_toggle = true;
        }
      }

      // Hide the current cell
      if ( enable_toggle ) {
        current_cell.element.slideToggle();
      }

      // Proceed to the next cell
      index++;
      current_cell = IPython.notebook.get_cell( index );
      if( current_cell === null )
        break;
      cell_level = get_cell_level( current_cell );
    }

  };


  /**
   * Initialize the extension.
   * Hides all cells that were marked as collapsed.
   */
  var init_toggle_heading = function(){

    // Add a button to the toolbar
    IPython.toolbar.add_buttons_group([{
      label:'toggle heading',
      icon:'icon-double-angle-up',
      callback: function () {
        var cell = find_toggleable_cell();
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


  // Initialize the extension
  init_toggle_heading();

}(IPython));
