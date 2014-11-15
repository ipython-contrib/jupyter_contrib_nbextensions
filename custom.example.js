// custom.js using config.js API to load nbextensions
"use strict";

// get nbconfig/nbextensions.json from your local profile
// retrieve name of path to nbextension and boolean activate flag

define([
    'base/js/namespace',
    'jquery',
    'services/config',
    'base/js/utils',
    'base/js/events',
], function(IPython, $, configmod, utils, events) {
    var config = new configmod.ConfigSection('nbextensions',
                                    {base_url: utils.get_body_data("baseUrl")});
    config.load();
    
    config.loaded.then(function() {
        var path = config.data.path
        var activate = config.data.activate
        events.on('app_initialized.NotebookApp', function () {
            for (var key in path) {
                if (activate[key] === true) {
                    IPython.load_extensions(path[key])
                }
            }
        })
    })
})
    