
define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils',
], function(Jupyter, $, requirejs, events, utils) {
    "use strict";



    var Planner = function (nb) {
        var planner = this;
        this.notebook = nb;
        this.kernel = nb.kernel;
        this.km = nb.keyboard_manager;
        this.open = false;

        this.element = $("<div id='nbextension-planner'>");

        this.close_button = $("<i>").addClass('fa fa-close');
        this.close_button.click(function() {
           planner.close_planner();
        });

        this.element.append(this.close_button);

        $("body").append(this.element);
    }

    Planner.prototype.open_planner = function () {
        this.open = true;
        var site_height = $("#site").height();
        this.element.animate({
            height: site_height,
        }, 200);
        this.element.show();
    }

    Planner.prototype.close_planner = function () {
        this.open = false;
        this.element.animate({
            height: 0,
        }, 100);
    }



    var load_ipython_extension = function() {
             Jupyter.toolbar.add_buttons_group([
                 Jupyter.keyboard_manager.actions.register ({
                      'help'   : 'Customise font',
                      'icon'   : 'fas fa-font',
                      'handler': function () {
                            //TODO
                      }
                 }, 'customise-font', 'toolbar'),

                 Jupyter.keyboard_manager.actions.register ({
                      'help'   : 'Spell Checker',
                      'icon'   : 'fas fa-check',
                      'handler': function () {
                             //TODO
                      }
                 }, 'spell-checker', 'toolbar'),

                 Jupyter.keyboard_manager.actions.register ({
                    'help'   : 'Voice Control',
                    'icon'   : 'fas fa-microphone',
                    'handler': function () {
                            //TODO
                    }
                 }, 'voice-control', 'toolbar'),

                 Jupyter.keyboard_manager.actions.register ({
                    'help'   : 'Planner',
                    'icon'   : 'fas fa-sticky-note',
                    'handler': function () {

                        var link = document.createElement("link");
                        link.type = "text/css";
                        link.rel = "stylesheet";
                        link.href = requirejs.toUrl("./planner.css");
                        document.getElementsByTagName("head")[0].appendChild(link);
                        new Planner(Jupyter.notebook).open_planner();
                        console.log('new planner')
                    }
                 }, 'planner', 'toolbar'),

                 Jupyter.keyboard_manager.actions.register ({
                    'help'   : 'Custom themes',
                    'icon'   : 'fas fa-clone',
                    'handler': function () {
                        //TODO    
                    }
                 }, 'customise-theme', 'toolbar'),
            ]);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});