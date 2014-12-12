// Adds a button to hide the input part of the currently selected cells

(function (IPython) {
  "use strict";


  var hide_input = function () {

    // Find the selected cell
    var cell = IPython.notebook.get_selected_cell();
    // Toggle visibility of the input div
    cell.element.find("div.input").toggle('slow')

  if ( cell.metadata.input_collapsed ) {
    cell.metadata.input_collapsed = false;
  } else {
    cell.metadata.input_collapsed = true;
  }
  };


  var init_hide_input = function(){

    // Add a button to the toolbar
    IPython.toolbar.add_buttons_group([{
      label:'hide input',
      icon:'fa-chevron-up',
      callback:hide_input,
    }]);

    // Collapse all cells that are marked as hidden
    var cells = IPython.notebook.get_cells();
    cells.forEach( function(cell){
      if( cell.metadata.input_collapsed ){
        cell.element.find("div.input").toggle(0);
      }
    }
    );

    // Write a message to the console to confirm the extension loaded
    console.log("hide_input cell extension loaded correctly");

    return true;
  }


  // Initialize the extension
  init_hide_input();

}(IPython));
