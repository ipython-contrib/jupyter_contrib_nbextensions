// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

define([
    'base/js/namespace',
    'jquery',
    'require',
    'notebook/js/textcell',
    'base/js/utils',
],   function(Jupyter, $, requirejs, textcell, utils) {
    "use strict";

    var MathJax = window.MathJax;

    var load_ipython_extension = function() {
        var btn_grp = Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
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
        ]);
        $(btn_grp).find('.btn').attr('id', 'reset_numbering');
        MathJax.Hub.Config({
          TeX: { equationNumbers: { autoNumber: "AMS" } }
        });
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
