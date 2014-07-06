// Allow Python-code in markdown cells
// Encapsulate using {{...}}
// - You can also return html or markdown from your Python code
// - You can embed images, however they will be sanitized on reload.

"using strict";

var python_markdown_extension = (function() {
    var security = IPython.security;
    
    var execute_python = function(cell,text) {
        // search for code in double curly braces: {{}}
        text = text.replace(/{{(.*?)}}/g, function(match,tag,cha) {
            var code = tag;
            var id = 'python_'+cell.cell_id+'_'+cha;
            var thiscell = cell;
            var thismatch = tag;
            
            /* there a two possible options:
              a) notebook dirty: execute 
              b) notebook clean: only display */
        if (IPython.notebook.dirty == true) {
            cell.metadata.variables = {}; 
            this.callback = function (out_data)
                    {
                    var has_math = false;
                    var ul = out_data.content.data;
                    if (ul != undefined) {
                        if ( ul['image/jpeg'] != undefined) {
                            var jpeg =  ul['image/jpeg'];
                            var html = '<img src="data:image/jpeg;base64,'+ jpeg + '"/>';
                        } else if ( ul['image/png'] != undefined) {
                            var png =  ul['image/png'];
                            var html = '<img src="data:image/png;base64,'+ png + '"/>';
                        } else if ( ul['text/html'] != undefined) {
                           var html = ul['text/html'];
                        } else if ( ul['text/latex'] != undefined) {
                            var html = ul['text/latex'];
                            has_math = true;
                        } else {
                            var result = (ul['text/plain']); // we could also use other MIME types here ?
                            html = marked(result);
                            var t = html.match(/<p>(.*?)<\/p>/)[1]; //strip <p> and </p> that marked adds and we don't want
                            html = t ? t : html;
                        }
                        thiscell.metadata.variables[thismatch] = html;
                        var el = document.getElementById(id);
                        el.innerHTML = el.innerHTML + html; // output result 
                        if (has_math == true) MathJax.Hub.Queue(["Typeset",MathJax.Hub,el]);                        
                    }
                }
            var callbacks = { iopub : { output: callback } };
            if (IPython.notebook.kernel != null) {
                IPython.notebook.kernel.execute(code, callbacks, {silent: false});
                return "<span id='"+id+"'></span>"; // add HTML tag with ID where output will be placed
                };
            return match;
         }
        else {
            /* Notebook not dirty: replace tags with metadata */
            var val = cell.metadata.variables[tag];
            return "<span id='"+id+"'>"+val+"</span>";
            }
        }); 
        return text;
    };

    // Override original markdown render function */
    IPython.MarkdownCell.prototype.render = function () {
        var cont = IPython.TextCell.prototype.render.apply(this);
        cont = cont || (this.metadata.variables == undefined) || (Object.keys(this.metadata.variables).length > 0);

        if (cont) {
            var text = this.get_text();
            var math = null;
            if (text === "") { text = this.placeholder; }
            text = execute_python(this,text);
            var text_and_math = IPython.mathjaxutils.remove_math(text);
            text = text_and_math[0];
            math = text_and_math[1];
            var html = marked.parser(marked.lexer(text));
            html = IPython.mathjaxutils.replace_math(html, math);
            html = security.sanitize_html(html);
            html = $($.parseHTML(html));
            // links in markdown cells should open in new tabs
            html.find("a[href]").not('[href^="#"]').attr("target", "_blank");
            this.set_rendered(html);
            this.element.find('div.input_area').hide();
            this.element.find("div.text_cell_render").show();
            this.typeset();
        }
        return cont;
    };
    
    /* show values stored in metadata on reload */
    doit = function() {   
        var ncells = IPython.notebook.ncells()
        var cells = IPython.notebook.get_cells();
        for (var i=0; i<ncells; i++) { 
            var cell=cells[i];
            if ( (cell.metadata.variables != undefined) && Object.keys(cell.metadata.variables).length > 0) { 
                cell.render();
            }
        };  
    }     
    $([IPython.events]).on('status_started.Kernel',doit); 
})();
