// Cellstate - indicate if cell has been executed or modified after loading
// n - new cell, not yet evaluated
// x - cell has been executed
// d - cell has been changed

"using strict";
require(['/static/components/codemirror/addon/comment/comment.js']);
var cellstate_extension = (function() {

  function celltypeMarker(val) {
    var marker = document.createElement("div");
    marker.style.color = "#822";
    marker.innerHTML = val;
    return marker;
}

function makeMarker(cell,val,n) {
    console.log(cell,val);
    if (cell.metadata.run_control == undefined){
        cell.metadata.run_control = {};
    }
    
    if (cell.metadata.run_control.state == undefined){
        cell.metadata.run_control.state = 'n';
    }

    if (val == '') { val = cell.metadata.run_control.state; };
    cell.metadata.run_control.state = val;   
    n=0;
    cell.code_mirror.setGutterMarker(n, "cellstate",  celltypeMarker(val));
};

    /**
     * Register newly created cell
     *
     * @param {Object} event
     * @param {Object} nbcell notebook cell
     */
    create_cell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        if ((cell instanceof IPython.CodeCell)) {
            makeMarker(cell,'n',0);
        }
    };
    execute_cell = function(event,nbcell) {
        var cell = nbcell.cell;
        makeMarker(cell,'x',0);
    };
    set_dirty = function(event,value) {
        var cell = IPython.notebook.get_selected_cell();
        makeMarker(cell,'d',0);
    };

    function changeEvent(cm, obj) {
        var cell = IPython.notebook.get_selected_cell();
        var n= obj.from.line;
        makeMarker(cell,'d',n);
    }

    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) {
            cell.code_mirror.on("change", changeEvent);
            var gutters = cell.code_mirror.getOption('gutters');
            cell.code_mirror.setOption('gutters', [gutters, "cellstate" ]);
            makeMarker(cell,'',0);
        }
    };

    /* new kernel start means no cell has been executed yes */
    function first_load() {
        var cells = IPython.notebook.get_cells();
        for(var i in cells){
            var cell = cells[i];
            if ((cell instanceof IPython.CodeCell)) {
                cell.code_mirror.on("change", changeEvent);
                var gutters = cell.code_mirror.getOption('gutters');
                cell.code_mirror.setOption('gutters', [gutters, "cellstate" ]);
                makeMarker(cell,'n',0);
            }
        }
    };
    
    $([IPython.events]).on('create.Cell',create_cell);
    $([IPython.events]).on('execute.Cell', execute_cell); 
    $([IPython.events]).on('notebook_loaded.Notebook', first_load);
})();
