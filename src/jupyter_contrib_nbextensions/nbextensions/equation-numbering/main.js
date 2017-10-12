// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

define([
    'base/js/namespace',
    'jquery',
    'require',
    'notebook/js/textcell',
    'base/js/utils',
],   function(Jupyter, $, require, textcell, utils) {
    "use strict";

    var MathJax = window.MathJax;

    var load_ipython_extension = function() {
        Jupyter.toolbar.add_buttons_group([{
            id: 'reset_numbering',
            action: Jupyter.keyboard_manager.actions.register ({
                help   : 'Reset equation numbering',
                icon   : 'fa-sort-numeric-asc',
                handler: function () {
                    MathJax.Hub.Queue(
                        ["resetEquationNumbers", MathJax.InputJax.TeX],
                        ["PreProcess", MathJax.Hub],
                        ["Reprocess", MathJax.Hub]
                    );
                    $('#reset_numbering').blur();
                }
            }, 'reset-numbering', 'equation_numbering')
        }]);
        MathJax.Hub.Config({
          TeX: { equationNumbers: { autoNumber: "AMS" } }
        });
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
