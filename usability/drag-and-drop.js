//----------------------------------------------------------------------------
//  Copyright (C) 2014  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// add drag&drop functionality
// Tested with Firefox and Chrome

// TODO: one can still drop images into a codecell, if the cell type is changed interactively

"using strict";

drag_and_drop = function() {

    /* the dragover event needs to be canceled to allow firing the drop event */
    window.addEventListener('dragover', function(event){
        if (event.preventDefault) { event.preventDefault(); };
    });

    /* allow dropping an image in notebook */
    window.addEventListener('drop', function(event){
        var cell = IPython.notebook.get_selected_cell();
        event.preventDefault();
        if(event.stopPropagation) {event.stopPropagation();}
        if (cell.mode == "command") {  
            if (event.dataTransfer.items != undefined) { 
                /* Chrome here */
                var items = event.dataTransfer.items;
                for (var i = 0; i < items.length; ++i) {
                    /* data coming from local file system, must be an image to allow dropping*/
                    if (items[i].kind == 'file' && items[i].type.indexOf('image/') !== -1) {
                        var blob = items[i].getAsFile();
                        if (blob.size > 100000 ) { alert('Size exceeds 100K, not reccomended'); }                        
                        var reader = new FileReader();
                        reader.onload = ( function(evt) {
                            var new_cell = IPython.notebook.insert_cell_below('markdown');
                            var str = '<img src="' + evt.target.result + '"/>';
                            new_cell.set_text(str);
                            new_cell.rendered = false;
                            new_cell.read_only = true;
                            new_cell.render();
                            event.preventDefault();
                            } );
                        reader.readAsDataURL(blob);
                    } else if (items[i].kind == 'string') {
                        /* base64 data coming from browser */
                        var new_cell = IPython.notebook.insert_cell_below('markdown');
                        var data = event.dataTransfer.getData('text/plain');
                        if (data.size > 100000 ) { alert('Size exceeds 100K, not reccomended'); }                        
                        var str = '<img  src="' + data + '"/>';
                        new_cell.set_text(str);
                        new_cell.rendered = false;
                        new_cell.read_only = true; 
                        new_cell.render();
                        event.preventDefault();
                        return;
                    }
                }
            } else { 
                /* Firefox here */
                var files = event.dataTransfer.files;
                if (files.length == 0) {
                    /* base64 data coming from browser */
                    var new_cell = IPython.notebook.insert_cell_below('markdown');
                    var data = event.dataTransfer.getData('text/plain');
                    if (data.size > 100000 ) { alert('Size exceeds 100K, not reccomended'); }                        
                    var str = '<img  src="' + data + '"/>';
                    new_cell.set_text(str);
                    new_cell.rendered = false;
                    new_cell.read_only = true;                       
                    new_cell.render();
                    event.preventDefault();
                    return;
                    }
                /* data coming from local file system, must be an image to allow dropping*/
                for (var i=0; i < files.length; i++) {
                    var blob = event.dataTransfer.files[0];
                    if (blob.size > 100000 ) { alert('Size exceeds 100K, not reccomended'); }
                    if (blob.type.indexOf('image/') !== -1) {
                        var reader = new FileReader();
                            reader.onload = ( function(evt) {
                                var new_cell = IPython.notebook.insert_cell_below('markdown');
                                var str = '<img  src="' + evt.target.result + '"/>';
                                new_cell.set_text(str);
                                new_cell.rendered = false;
                                new_cell.read_only = true;                       
                                new_cell.render();
                                event.preventDefault();
                                } );
                        reader.readAsDataURL(blob);
                    }
                }   
            }
        }
    });

    
    /* 
     * make sure we do not drop images into a codemirror text field 
     */
    checktype = function(cm,evt) {
        if (event.dataTransfer.items != undefined)  
            {
            evt.codemirrorIgnore = true;
            }
        var blob = evt.dataTransfer.files[0];
        
        if (blob.type.indexOf('image/') !== -1) {
            evt.codemirrorIgnore = true;
            }
    }

    create_cell = function (event,nbcell,nbindex) {
        var cell = nbcell.cell;
        if ((cell instanceof IPython.CodeCell)) {
            cell.code_mirror.on('drop', checktype);
        }
    }; 
    
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) {
            cell.code_mirror.on('drop', checktype);
        }
    }; 
    
    $([IPython.events]).on('create.Cell',create_cell);        
}();
