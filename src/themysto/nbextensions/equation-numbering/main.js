// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

define([
    'base/js/namespace',
    'jquery',
    'require',
    'notebook/js/textcell',
    'base/js/utils',
    'services/config'
],   function(IPython, $, require, textcell, utils, configmod) {
    "use strict";

    var rerender_on_reset = true;
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    /**
     * Get option from config
     */
    config.loaded.then(function() {
        if (config.data.hasOwnProperty('equation_numbering_rerender') ) {
            if (typeof(config.data.equation_numbering_rerender) === "boolean") {
                rerender_on_reset = config.data.equation_numbering_rerender;
            }
        }
    });
    var load_ipython_extension = function() {
        IPython.toolbar.add_buttons_group([
            {
                id: 'reset_numbering',
                label: 'Reset equation numbering',
                icon: 'fa-sort-numeric-asc',
                callback: function () {
                    MathJax.Extension['TeX/AMSmath'].startNumber = 0;
                    if (rerender_on_reset === true) {
                        MathJax.Hub.Queue(["Reprocess", MathJax.Hub]);
                    }
                    $('#reset_numbering').blur();
                }
            }
        ]);
        MathJax.Hub.Config({
          TeX: { equationNumbers: { autoNumber: "AMS" } }
        });
        config.load();
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
