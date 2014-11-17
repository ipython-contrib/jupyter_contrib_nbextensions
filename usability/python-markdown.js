// Allow Python-code in markdown cells
// Encapsulate using {{...}}
// - You can also return html or markdown from your Python code
// - You can embed images, however they will be sanitized on reload.

define([
    'base/js/namespace',
    'jquery',
    'notebook/js/cell',
    'base/js/security',
    'components/marked/lib/marked',
    'base/js/events',
], function(IPython, $, cell, security, marked, events) {
    "use strict";
    if (IPython.version[0] != 3) {
        console.log("This extension requires IPython 3.x")
        return
    }
    var _on_reload = true; /* make sure cells with variables render on reload */ 
    var security = IPython.security;
    /*
     * Find Python expression enclosed in {{ }}, execute and add to text as
     * <span> tags. The actual content gets filled in later by a callback.
     * Already executed expressions are cached in cell metadata.
     *
     * @method execute_python
     * @param cell {Cell} notebook cell
     * @param text {String} text in cell
     */
    var execute_python = function(cell,text) {
        /* never execute code in untrusted notebooks */
        if (IPython.notebook.trusted === false ) {
            return text
        }
        /* always clear stored variables if notebook is dirty */
        if (IPython.notebook.dirty === true ) delete cell.metadata.variables 
    
        // search for code in double curly braces: {{}}
        text = text.replace(/{{(.*?)}}/g, function(match,tag,cha) {
            if (tag === "") return match;
            var code = tag;
            var id = 'python_'+cell.cell_id+'_'+cha; /* create an individual ID */
            var thiscell = cell;
            var thismatch = tag;
            
            /* there a two possible options:
               a) notebook dirty or variable not stored in metadata: evaluate variable
               b) notebook clean and variable stored in metadata: only display 
            */
            if (typeof cell.metadata.variables === "undefined") {
                cell.metadata.variables = {}
            }
            var val = cell.metadata.variables[thismatch]
            
            if (IPython.notebook.dirty === true || val === undefined) {
                cell.metadata.variables[thismatch] = {}
                cell.callback = function (out_data)
                        {
                        var has_math = false;
                        var ul = out_data.content.data;
                        if (ul != undefined) {
                            if ( ul['text/latex'] != undefined) {
                                var html = ul['text/latex'];
                                has_math = true;
                            } else if ( ul['image/svg+xml'] != undefined) {
                                var svg =  ul['image/svg+xml'];
                                /* embed SVG in an <img> tag, still get eaten by sanitizer... */
                                svg = btoa(svg); 
                                var html = '<img src="data:image/svg+xml;base64,'+ svg + '"/>';
                            } else if ( ul['image/jpeg'] != undefined) {
                                var jpeg =  ul['image/jpeg'];
                                var html = '<img src="data:image/jpeg;base64,'+ jpeg + '"/>';
                            } else if ( ul['image/png'] != undefined) {
                                var png =  ul['image/png'];
                                var html = '<img src="data:image/png;base64,'+ png + '"/>';
                            } else if ( ul['text/html'] != undefined) {
                               var html = ul['text/html'];
                            } else {
                                var result = (ul['text/plain']);
                                html = marked(result);
                                var t = html.match(/<p>(.*?)<\/p>/)[1]; //strip <p> and </p> that marked adds and we don't want
                                html = t ? t : html;
                            }
                            thiscell.metadata.variables[thismatch] = html;
                            var el = document.getElementById(id);
                            el.innerHTML = el.innerHTML + html; // output result 
                            if (has_math === true) MathJax.Hub.Queue(["Typeset",MathJax.Hub,el]);                        
                        }
                    }
                var callbacks = { iopub : { output: cell.callback } };
                if (cell.notebook.kernel != null) {
                    cell.notebook.kernel.execute(code, callbacks, {silent: false});
                    return "<span id='"+id+"'></span>"; // add HTML tag with ID where output will be placed
                    };
                return match;
            } else {
                /* Notebook not dirty: replace tags with metadata */
                var val = cell.metadata.variables[tag];
                return "<span id='"+id+"'>"+val+"</span>"
            }
        }) 
        return text
    }

    /*
     * Render markdown cell and replace {{...}} with python code
     *
     */
    var render_cell = function(cell) {
        var element = cell.element.find('div.text_cell_render');
        var text = element[0].innerHTML
        text = execute_python(cell,text);
        element[0].innerHTML = text
    }

    events.on("rendered.MarkdownCell", function(event, data) {
        render_cell(data.cell)
    });
   
    /* show values stored in metadata on reload */
    events.on("kernel_ready.Kernel", function() {
        var ncells = IPython.notebook.ncells()
        var cells = IPython.notebook.get_cells()
        for (var i=0; i<ncells; i++) { 
            var cell=cells[i]
            if ( cell.metadata.hasOwnProperty('variables')) { 
                render_cell(cell)
            }
        }
    _on_reload = false
    })
})
