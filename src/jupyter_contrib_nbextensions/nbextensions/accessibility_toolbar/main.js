
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

        this.element = $("<div id='nbextension-planner'>").addClass('col-md-4');

        this.close_button = $("<button/>").addClass('fa fa-close').attr('id', 'close_button');
        this.close_button.click(function() {
           planner.close_planner();
        });
        this.element.append(this.close_button);

        this.canvas = $('<canvas/>').attr('id', 'canvas')
            .attr('width', '200').attr('height', '200').attr('style', "border:1px solid #c3c3c3");

        this.element.append(this.canvas);

        $("#notebook").addClass('row').append(this.element);
        this.element.hide();
    }

    Planner.prototype.open_planner = function () {
        this.open = true;
        var site_height = $("#site").height();
        this.element.css('height', site_height);
        this.element.show({ direction: "left" }, 750);
        this.element.show();
        $("#notebook-container").addClass('col-md-8')
    }

    Planner.prototype.close_planner = function () {
        this.open = false;
        this.element.hide({direction: "right"}, 750);
        $("#notebook-container").removeClass('col-md-8');
    };

    Planner.prototype.toggle_planner = function () {
        this.open ? this.close_planner() : this.open_planner();
    }

    function setup_planner() {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = requirejs.toUrl("./planner.css");
        document.getElementsByTagName("head")[0].appendChild(link);

        console.log('New Planner Created');
        return new Planner(Jupyter.notebook);
    }



    var load_ipython_extension = function() {
        var planner = setup_planner();

        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Customise font',
                'icon'   : 'fas fa-font',
                'handler': function () {
                    //TODO
                }
            }, 'customise-font', 'accessibility-toolbar'),

            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Spell Checker',
                'icon'   : 'fas fa-check',
                'handler': function () {
                    //TODO
                }
            }, 'spell-checker', 'accessibility-toolbar'),

            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Voice Control',
                'icon'   : 'fas fa-microphone',
                'handler': function () {
                    //TODO
                }
            }, 'voice-control', 'accessibility-toolbar'),

            Jupyter.keyboard_manager.actions.register ({
                'help': 'Planner',
                'icon': 'fas fa-sticky-note',
                'handler': function () {
                    planner.toggle_planner();
                }
            }, 'planner', 'accessibility-toolbar'),

            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Custom themes',
                'icon'   : 'fas fa-clone',
                'handler': function () {
                    //TODO
                }
            }, 'customise-theme', 'accessibility-toolbar'),

        ]);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
