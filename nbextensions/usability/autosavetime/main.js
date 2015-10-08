define([
    'jquery',
    'base/js/namespace',
    'base/js/events',
    'base/js/utils',
    'services/config'
], function(
    $,
    IPython,
    events,
    utils,
    configmod
) {
    "use strict";

    // create config object to load parameters
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    // define default values for config parameters
    var params = {
        autosavetime_set_starting_interval : false,
        autosavetime_starting_interval : 2,
        autosavetime_show_selector : true
    };

    // update params with any specified in the server's config file
    var update_params = function() {
        for (var key in params) {
            if (config.data.hasOwnProperty(key))
                params[key] = config.data[key];
        }
    };

    config.loaded.then( function() {
        update_params();

        var si = params.autosavetime_starting_interval;
        var set_si = params.autosavetime_set_starting_interval;

        if (params.autosavetime_show_selector) {
            var select = $('<select class="ui-widget-content"/>');
            select.change(function() {
                 var interval = parseInt($(this).val(), 10) * 60 * 1000;
                 IPython.notebook.set_autosave_interval(interval);
            });

            var thresholds = [0,2,5,10,15,20,30,60];

            if (set_si && thresholds.indexOf(si) < 0) thresholds.push(si);

            thresholds.sort(function(a, b) { return a-b; });

            for (var i in thresholds) {
                var thr = thresholds[i];
                select.append($('<option/>').attr('value', thr).text(thr));
            }

            select.find('option[value="2"]').text('2 (default)');
            select.find('option[value="0"]').text('off');

            if (set_si) select.val(si);

            IPython.toolbar.element.append(
                $('<label class="navbar-text"/>').text('Autosave interval (min):')
            ).append(select);
        }

        events.on("autosave_enabled.Notebook", function(event, value) {
            if (set_si) {
                IPython.notebook.set_autosave_interval(si * 60 * 1000);
            }
            else {
                if (params.autosavetime_show_selector) {
                    select.val(parseInt(value, 10) / 60 / 1000);
                }
            }
        });
    });

    var load_ipython_extension = function() {
        config.load();
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
