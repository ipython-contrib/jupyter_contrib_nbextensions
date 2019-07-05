
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

        this.planner = $("<div id='nbextension-planner'>").addClass('col-md-4');

        this.planner.append(this.close_button);

        this.canvas = $('<div/>').attr('id', 'text_area').attr('contentEditable', 'true').attr('spellcheck', 'true');
        
        planner.create_toolbar(planner);

        this.planner.append($('<br/>'));

        this.main_body = $('<div/>').addClass('row').attr('id', 'main_body');
        // this.main_body.css('height', '100%');

        this.main_body.append(this.canvas);

        this.planner.append(this.main_body);

        $("#notebook").addClass('row').append(this.planner);
        this.planner.hide();
    };

    Planner.prototype.create_toolbar = function (planner) {
        const toolbar = $('<div/>').addClass('icon-bar');

        const close_icon = $('<i/>').addClass('fa fa-close');
        close_icon.click(function() {
            planner.close_planner();
        });
        const close = $('<a/>').append(close_icon);

        const bullet_icon = $('<i/>').addClass('fa fa-list')
        const bullet_list = $('<a/>').append(bullet_icon);

        const num_icon = $('<i/>').addClass('fa fa-list-ol');
        const num_list = $('<a/>').append(num_icon)

        const upload_icon = $('<i/>').addClass('fa fa-upload');
        const upload = $('<a/>').append(upload_icon);

        const draw_icon = $('<i/>').addClass('fa fa-pencil');
        const draw = $('<a/>').append(draw_icon);

        toolbar.append(close).append(bullet_list).append(num_list)
            .append(upload).append(draw);
        this.planner.append(toolbar);
    };

    Planner.prototype.open_planner = function () {
        this.open = true;
        var site_height = $("#site").height();
        this.planner.css('height', site_height);
        // this.element.show({ direction: "left" }, 750);
        this.planner.show();
        $("#notebook-container").addClass('col-md-8')
    };

    Planner.prototype.close_planner = function () {
        this.open = false;
        this.planner.hide({direction: "right"}, 750);
        $("#notebook-container").removeClass('col-md-8');
    };

    Planner.prototype.toggle_planner = function () {
        this.open ? this.close_planner() : this.open_planner();
    };

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
