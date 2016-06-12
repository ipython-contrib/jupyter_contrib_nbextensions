// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

define([
    'base/js/namespace',
    'jquery',
    'require',
    'notebook/js/textcell',
    'base/js/utils',
],   function(IPython, $, require, textcell, utils) {
    "use strict";

    var load_ipython_extension = function() {
        IPython.toolbar.add_buttons_group([
            {
                id: 'reset_numbering',
                label: 'Reset equation numbering',
                icon: 'fa-sort-numeric-asc',
                callback: function () {
                    MathJax.Hub.Queue(
                        ["resetEquationNumbers", MathJax.InputJax.TeX],
                        ["PreProcess", MathJax.Hub],
                        ["Reprocess", MathJax.Hub]
                    );
                    $('#reset_numbering').blur();
                }
            }
        ]);
        MathJax.Hub.Config({
          TeX: { equationNumbers: { autoNumber: "AMS" } }
        });
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
