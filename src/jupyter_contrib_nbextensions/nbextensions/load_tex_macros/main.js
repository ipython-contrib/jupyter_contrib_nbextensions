define(function(require, exports, module) {
    var Jupyter = require('base/js/namespace');

    function loadLatexUserDefs() { 
        $.get('latexdefs.tex').done(function(data) {
            data = data.replace(/^/gm, '\$\$\$').replace(/$/gm, '\$\$\$');
            if ($('#latexdefs').length > 0) $('#latexdefs').remove();
            $('body').append($('<div/>').attr('id', 'latexdefs').text(data));
            console.log('latex_envs: loaded user LaTeX definitions latexdefs.tex');
        }).fail(function() {
            console.log('load_tex_macros: failed to load user LaTeX definitions latexdefs.tex')
        });
    }

    function rerenderMaths() { // probably something like that
            MathJax.Hub.Queue(
              ["resetEquationNumbers",MathJax.InputJax.TeX],
              ["PreProcess", MathJax.Hub],
              ["Reprocess", MathJax.Hub]
            );
    }

    function load_ipython_extension() {
         "use strict";
       
        if (Jupyter.notebook._fully_loaded) {  
            loadLatexUserDefs();       
            rerenderMaths(); 
        } else {
            $([Jupyter.events]).on("notebook_loaded.Notebook", function() {
                      loadLatexUserDefs();   
                      rerenderMaths();  
            })
        }
    }
    return {
            load_ipython_extension: load_ipython_extension,
    };
})
