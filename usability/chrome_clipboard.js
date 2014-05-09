//----------------------------------------------------------------------------
//  Copyright (C) 2014  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

// add system clipboard functionality with chrome
// works with images and notebook cells (MIME-type 'notebook-cell/json')

"using strict";

chrome_clipboard = function() {

    if (window.chrome == undefined) return

    /* 
     * override clipboard 'paste' and insert new cell from json data in clipboard
     */
    window.addEventListener('paste', function(event){
        var cell = IPython.notebook.get_selected_cell();
        if (cell.mode == "command" ) {
            event.preventDefault();
            /* paste images */
            if (event.dataTransfer != undefined) {
                var items = event.clipboardData.items;
                for (var i = 0; i < items.length; ++i) {
                    if (items[i].kind == 'file' && items[i].type.indexOf('image/') !== -1) {
                        var blob = items[i].getAsFile();
                        if (blob.size > 100000 ) alert('Size exceeds 100K, not recommended');
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
            } else {
            /* paste notebook cell */
            var data = event.clipboardData.getData('notebook-cell/json');
            if (data) {
                var new_cell_data = JSON.parse(data);
                var new_cell = IPython.notebook.insert_cell_below(new_cell_data.cell_type);
                new_cell.fromJSON(new_cell_data);
                }
            }
        }
    });

    /* 
     * override clipboard 'copy' and copy current cell as json and text to clipboard
     */
    window.addEventListener('copy', function(event){
        
        var cell = IPython.notebook.get_selected_cell();
        if (cell.mode == "command") { 
            var sel = window.getSelection();
            if (sel.type == "Range") return; /* default: copy marked text */
            event.preventDefault();
            var j = cell.toJSON();
            var json = JSON.stringify(j);           
            var text = cell.code_mirror.getValue();
            /* copy cell as json and cell contents as text */
            event.clipboardData.setData('notebook-cell/json',json);        
            event.clipboardData.setData("Text", text);
        }
    });    

    /* 
     * override clipboard 'cut' and copy current cell as json and text to clipboard
     */
    window.addEventListener('cut', function(event){
        
        var cell = IPython.notebook.get_selected_cell();
        if (cell.mode == "command" ) {  
            var sel = window.getSelection();
            if (sel.type == "Range") return; /* default: cut marked text */
            event.preventDefault();
            var j = cell.toJSON();
            var json = JSON.stringify(j);
            var text = cell.code_mirror.getValue();       
            /* copy cell as json and cell contents as text */        
            event.clipboardData.setData('notebook-cell/json',json);
            event.clipboardData.setData("Text", text);
            IPython.notebook.delete_cell(IPython.notebook.find_cell_index(cell));
        }
    });

}();
