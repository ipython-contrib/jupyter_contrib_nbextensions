// Allow Python-code in markdown cells
// Encapsulate using {{...}}

"using strict";

var python_markdown_extension = (function() {
    var security = IPython.security;
    
    var execute_python = function(cell,text) {
        cell.metadata.hascode = false; 
        // search for code in double curly braces: {{}}
        text = text.replace(/{{(.*?)}}/g, function(match,tag,cha) {
            var code = tag;
            var id = 'python_'+cell.cell_id+'_'+cha;
            cell.metadata.cellhascode = true; // mark cell, so it always gets rendered
            this.callback = function (out_data)
                {
                    var has_math = false;
                    var ul = out_data.content.data;
                    if (ul != undefined) {
                        if ( ul['image/jpeg'] != undefined) {
                            var jpeg =  ul['image/jpeg'];
                            var result = '<img src="data:image/jpeg;base64,'+ jpeg + '"/>';
                        } else if ( ul['image/png'] != undefined) {
                            var png =  ul['image/png'];
                            var result = '<img src="data:image/png;base64,'+ png + '"/>';
                        } else if ( ul['text/latex'] != undefined) {
                            var result = ul['text/latex'];
                            has_math = true;
                        } else {
                            var result = (ul['text/plain']); // we could also use other MIME types here ?
                        }
                        var el = document.getElementById(id);
                        el.innerHTML = el.innerHTML + result; // output result 
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
        ); 
        return text;
    };

    // Override original markdown render function */
    IPython.MarkdownCell.prototype.render = function () {

        var cont = IPython.TextCell.prototype.render.apply(this);
        if (this.metadata.cellhascode == undefined) this.metadata.cellhascode = true;
        
        if (cont || this.metadata.cellhascode) {
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
})();
