// Adds a button to hide the input part of the currently selected cells


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


init_hide_input = function(){

  // Add a button to the toolbar
  IPython.toolbar.add_buttons_group([{
    label:'hide input',
    icon:'icon-chevron-up',
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
}


// The following line somehow does not work,
// i.e. init_hide_input never gets called.
//$([IPython.events]).on('notebook_loaded.Notebook', init_hide_input);
// work-around:
init_hide_input();
