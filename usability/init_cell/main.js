console.log("--loading initialisation cell extension--")

var CellToolbar= IPython.CellToolbar;


var init_cell = CellToolbar.utils.checkbox_ui_generator('Initialisation Cell',
     // setter
     function(cell, value){
         // we check that the _draft namespace exist and create it if needed
         if (cell.metadata._draft == undefined){cell.metadata._draft = {}}
            // set the value
            cell.metadata._draft.init_cell = value
         },
     //getter
     function(cell){ var ns = cell.metadata._draft;
         // if the _draft namespace does not exist return undefined
         // (will be interpreted as false by checkbox) otherwise
         // return the value
         return (ns == undefined)? undefined: ns.init_cell
         }
 );

CellToolbar.register_callback('init_cell.chkb', init_cell);

CellToolbar.register_preset('Initialisation Cell', ['init_cell.chkb'])


var run_init = function(){

    var cells = IPython.notebook.get_cells();

    for(var i in cells){
        var cell = cells[i];
        var namespace =  cell.metadata._draft|| {};
        var isInit = namespace.init_cell;
        // you also need to chack that cell is instance of code cell
        if( isInit === true){
            cell.execute();
        }
    }

};


var add_run_init_button = function(){
    IPython.toolbar.add_buttons_group([
         {
              'label'   : 'run init_cell',
              'icon'    : 'fa-calculator',
              'callback': run_init
         }
         ]);
};

$([IPython.events]).on('notebook_loaded.Notebook',add_run_init_button);


console.log("initialisation cell extension loaded correctly")

