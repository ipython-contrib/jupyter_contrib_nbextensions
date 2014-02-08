//----------------------------------------------------------------------------
//  Copyright (C) 2014  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// add system clipboard and drag&drop functionality

"using strict";

/* override clipboard 'paste' and insert new cell from json data in clipboard
 * works only with chrome
 */
window.addEventListener('paste', function(event){
    var cell = IPython.notebook.get_selected_cell();
    if (cell.mode == "command" ) {
        event.preventDefault();
        /* first check for images in the clipboard */
        var items = event.clipboardData.items;
        for (var i = 0; i < items.length; ++i) {
            if (items[i].kind == 'file' && items[i].type.indexOf('image/') !== -1) {
                var blob = items[i].getAsFile();
                
                var reader = new FileReader();
                reader.onload = ( function(evt) {
                    var new_cell = IPython.notebook.insert_cell_below('markdown');
                    var str = '<img src="' + evt.target.result + '">';
                    new_cell.set_text(str);
                    new_cell.rendered = false;
                    new_cell.read_only = true;
                    new_cell.render();
                    event.preventDefault();
                    return;
                    } );
                reader.readAsDataURL(blob);
            }
        }
    /* now check for a notebook cell */
    var data = event.clipboardData.getData('notebook-cell/json');
    if (data) {
        var new_cell_data = JSON.parse(data);
        var new_cell = IPython.notebook.insert_cell_below(new_cell_data.cell_type);
        new_cell.fromJSON(new_cell_data);
        }
    }
});

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
        console.log("dragdrop", event);
        if (event.dataTransfer.items != undefined) { 
            var items = event.dataTransfer.items;
            for (var i = 0; i < items.length; ++i) {
                console.log("item:", i, "kind:",items[i].kind, "type:", items[i].type);
                if (items[i].kind == 'file' && items[i].type.indexOf('image/') !== -1) {
//                if (items[i].kind == 'file' ) { /* this would allow anything, like pdf ... */
                    var blob = items[i].getAsFile();
                    
                    var reader = new FileReader();
                    reader.onload = ( function(evt) {
                        var new_cell = IPython.notebook.insert_cell_below('markdown');
                        //var str = '<img src="' + evt.target.result + '">';
                        var str = '<embed src="' + evt.target.result + '"/>';
                        new_cell.set_text(str);
                        new_cell.rendered = false;
                        new_cell.read_only = true;
                        new_cell.render();
                        event.preventDefault();
                        return;
                        } );
                    reader.readAsDataURL(blob);
                    console.log("blob:",blob);
                }
            }
        } else {
//            var len = event.dataTransfer.files.length;
//            if (len > 0 && len < 100000 ) { /* limit size */
                var blob = event.dataTransfer.files[0];
                console.log("Firefox:", blob);
                var reader = new FileReader();
                    reader.onload = ( function(evt) {
                        var new_cell = IPython.notebook.insert_cell_below('markdown');
                        console.log("Loadad:", evt);
                        //var str = '<img src="' + evt.target.result + '">';
                        var str = '<embed  src="' + evt.target.result + '"/>';
                        new_cell.set_text(str);
                        new_cell.rendered = false;
                        new_cell.read_only = true;                       
                        new_cell.render();
                        event.preventDefault();
                        return;
                        } );
                reader.readAsDataURL(blob);
//            }
        }
    }
});

/* override clipboard 'copy' and copy current cell as json and text to clipboard
 * works only with chrome
 */
window.addEventListener('copy', function(event){
    
    var cell = IPython.notebook.get_selected_cell();
    if (cell.mode == "command") {  
        event.preventDefault();
        var j = cell.toJSON();
        var json = JSON.stringify(j);           
        var text = cell.code_mirror.getValue();
        event.clipboardData.setData('notebook-cell/json',json);        
        event.clipboardData.setData("Text", text);
    }
});    
/* override clipboard 'cut' and copy current cell as json and text to clipboard
 * works only with chrome
 */
window.addEventListener('cut', function(event){
    
    var cell = IPython.notebook.get_selected_cell();
    if (cell.mode == "command" ) {  
        event.preventDefault();
        var j = cell.toJSON();
        var json = JSON.stringify(j);
        var data = event.clipboardData.setData('notebook-cell/json',json);
        var str = cell.code_mirror.getValue();
        event.clipboardData.setData("Text", str);
        IPython.notebook.delete_cell(IPython.notebook.find_cell_index(cell));
    }
});
