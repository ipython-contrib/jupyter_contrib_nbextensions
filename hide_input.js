// Adds a button to hide the input part of the currently selected cells


var hide_input = function () {
  // find the selected cell
  var cell = IPython.notebook.get_selected_cell();
  // toggle visibility of the input div
  cell.element.find("div.input").toggle('slow')

    if ( cell.metadata.input_collapsed ) {
      cell.metadata.input_collapsed = false;
    } else {
      cell.metadata.input_collapsed = true;
    }
};

init_hide_input = function(){

  // collapse all cells that are marked as hidden
  var cells = IPython.notebook.get_cells();
  cells.forEach( function(cell){
    if( cell.metadata.input_collapsed ){
      cell.element.find("div.input").toggle(0);
    }
  }
  );

  console.log("hide_input cell extension loaded correctly");
}


// add a button to the toolbar
IPython.toolbar.add_buttons_group([{
  label:'hide input',
  icon:'ui-icon-carrat-1-n',
  callback:hide_input,
}]);

// The following line somehow seems not to
//$([IPython.events]).on('notebook_loaded.Notebook', init_hide_input);
// work-around:
init_hide_input();
