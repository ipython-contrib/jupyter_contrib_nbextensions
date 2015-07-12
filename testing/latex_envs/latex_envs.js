
/*

*/

var eqNum = 0; // begins equation numbering at eqNum+1
var eqLabelWithNumbers = true; //if true, label equations with equation numbers; otherwise using the tag specified by \label
var conversion_to_html = false;



//var run_this = function() {
    
define(["require", "/nbextensions/thmsInNb.js"], function (require,thmsInNb) {    

    var maps = initmap();
    environmentMap=maps[0];
    cmdsMap=maps[1];
    eqLabNums=maps[2];



    //define(["require"], function (require) { 
    var load_css = function(name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        //link.href = name;
        document.getElementsByTagName("head")[0].appendChild(link);

    };

    var load_ipython_extension = function() {
    require(['components/marked/lib/marked'], function(marked) {    
        "use strict";
        if (IPython.version[0] <= 2) {
            console.log("This extension requires IPython >= 2.x")
            return
        }

        var security = IPython.security;
        var _on_reload = true; /* make sure cells render on reload */

        


        /* Override original markdown render function */
        /* The idea was took from python-markdown extension https://gist.github.com/juhasch/c37408a0d79156f28c17#file-python-markdown-js */

        // This used to work in IPython 2.x

      /*  IPython.MarkdownCell.prototype.render = function() {
            var cont = IPython.TextCell.prototype.render.apply(this);
            console.log("result of textcell prototype",cont)

            cont = cont || IPython.notebook.dirty || _on_reload
            if (cont) {
                console.log("overriding markdown cell renderer")
                var text = this.get_text();
                var math = null;
                if (text === "") {
                    text = this.placeholder;
                }
                var text_and_math = IPython.mathjaxutils.remove_math(text);
                text = text_and_math[0];
                math = text_and_math[1];
                console.log("text",text)
                var html = marked.parser(marked.lexer(text));
                html = IPython.mathjaxutils.replace_math(html, math);
                html = thmsInNbConv(html); //<----- thmsInNb patch here
                html = security.sanitize_html(html);
                console.log("html",html)
                html = $($.parseHTML(html));
                // links in markdown cells should open in new tabs
                html.find("a[href]").not('[href^="#"]').attr("target", "_blank");
                this.set_rendered(html);
                this.element.find('div.input_area').hide();
                this.element.find("div.text_cell_render").show();
                this.typeset();

            }
            return cont
        };*/

        // for IPython v 3
    IPython.MarkdownCell.prototype.render = function () {
        var cont = IPython.TextCell.prototype.render.apply(this);
        if (cont || IPython.notebook.dirty || _on_reload) {
            var that = this;
            var text = this.get_text();
            var math = null;
            if (text === "") { text = this.placeholder; }
            var text_and_math = IPython.mathjaxutils.remove_math(text);
            text = text_and_math[0];
            math = text_and_math[1];
            marked(text, function (err, html) {
                html = IPython.mathjaxutils.replace_math(html, math);
                html = thmsInNbConv(marked,html); //<----- thmsInNb patch here
                html = security.sanitize_html(html);
                html = $($.parseHTML(html));
                // add anchors to headings
                html.find(":header").addBack(":header").each(function (i, h) {
                    h = $(h);
                    var hash = h.text().replace(/ /g, '-');
                    h.attr('id', hash);
                    h.append(
                        $('<a/>')
                            .addClass('anchor-link')
                            .attr('href', '#' + hash)
                            .text('¶')
                    );
                });
                // links in markdown cells should open in new tabs
                html.find("a[href]").not('[href^="#"]').attr("target", "_blank");
                that.set_rendered(html);
                that.typeset();
                that.events.trigger("rendered.MarkdownCell", {cell: that});
            });
        }
        return cont;
    };

     

        var init_cells = function() {

            var ncells = IPython.notebook.ncells();
            var cells = IPython.notebook.get_cells();
            var maps = initmap(); // this is to reset the counters in case of reload
            environmentMap=maps[0]; cmdsMap=maps[1];  eqLabNums=maps[2]; 
            eqNum = 0;
            console.log("reloading cells");
            for (var i = 0; i < ncells; i++) {
                var cell = cells[i];
                if (cell instanceof IPython.TextCell) {
                cell.render();};
            }
        }
        init_cells();

        /* on reload */
        $([IPython.events]).on('status_started.Kernel', function() {

            init_cells();
            _on_reload = false;
        })


            IPython.toolbar.add_buttons_group([
                {
            id : 'doReload',
            label : 'latex_envs: Refresh rendering ',
            icon : 'fa-retweet',
            callback : init_cells
                }
            ]);



    });
    };

    console.log("Loading latex_envs.css");

    //load_css('/nbextensions/latex_envs.css')
    load_css('./latex_envs.css')
  

    
    //load_ipython_extension();
    return {
        load_ipython_extension: load_ipython_extension,
    };
}); //End of run_this

//run_this();
console.log("Loading ./latex_envs.js");
