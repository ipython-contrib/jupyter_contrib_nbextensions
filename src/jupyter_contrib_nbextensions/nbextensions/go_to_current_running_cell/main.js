// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// This is an extension allows you to jump to the current running cell.
//  You can also activate this functionality automatically,
//  i.e., your view is always scolling to the current cell.

//
// Keyboard shortcuts: Alt-I and Alt-down (works with single cells also -- this is useful!)
// The extension is simple, create function and then register the action and shortkey separately,
// so that user can update the shortkey according to their need.



define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events'
], function (Jupyter, $, requirejs, events) {
    "use strict";

    var action_follow_cell_on; // set on registration
    var action_follow_cell_off; // set on registration
    var action_go_to_runing_cell; // set on registration
    var params = {
        is_follow_cell: false,
        go_to_running_cell_shortcut: 'Alt-I',
        follow_cell_on_shortcut: "Alt-;",
        follow_cell_off_shortcut: "Alt-'",
        button_icon: 'fa-anchor'
    };

    function scrollIntoRunningCell(event, data) {
        $('.running')[0].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }

    // update params with any specified in the server's config file
    var update_params = function () {
        var config = Jupyter.notebook.config;
        for (var key in params) {
            if (config.data.hasOwnProperty(key))
                params[key] = config.data[key];
        }
    };

    // Go to Running cell shortcut
    function go_to_running_cell(event) {

        // Find running cell and click the first one
        if ($('.running').length > 0) {
            $('.running')[0].scrollIntoView();
        }
        return false;
    }

    function follow_running_cell_on(event) {
        Jupyter.notebook.events.on('finished_execute.CodeCell', scrollIntoRunningCell);
        return false;
    }

    function follow_running_cell_off(event) {
        Jupyter.notebook.events.off('finished_execute.CodeCell', scrollIntoRunningCell);
        return false;
    }

    // Register actions to collapse and uncollapse the selected heading cell

    function register_new_actions() {
        action_go_to_runing_cell = Jupyter.keyboard_manager.actions.register({
            handler: go_to_running_cell,
            help: "Go to first executing cell",
            help_index: 'aa',
            icon: params.button_icon
        }, 'Go to first running cell', 'Go To Running Cell'
        )
        action_follow_cell_on = Jupyter.keyboard_manager.actions.register({
            handler: follow_running_cell_on,
            help: "Follow running cell on",
            help_index: 'aa'
        }, 'Follow running cell on', 'Go To Running Cell'
        )
        action_follow_cell_off = Jupyter.keyboard_manager.actions.register({
            handler: follow_running_cell_off,
            help: "Follow running cell off",
            help_index: 'aa'
        }, 'Follow running cell off', 'Go To Running Cell'
        );

        if (params.is_follow_cell) {
            Jupyter.notebook.events.on('finished_execute.CodeCell', scrollIntoRunningCell);
        }
    }

    // Register keyboard shortcuts according to parameters
    function register_keyboard_shortcuts() {

        var shortcut, edit_shortcuts = Jupyter.keyboard_manager.command_shortcuts;
        shortcut = params.go_to_running_cell_shortcut;
        if (shortcut) {
            edit_shortcuts.add_shortcut(shortcut, action_go_to_runing_cell);
        }

        shortcut = params.follow_cell_on_shortcut;
        if (shortcut) {
            edit_shortcuts.add_shortcut(shortcut, action_follow_cell_on);
        }

        shortcut = params.follow_cell_off_shortcut;
        if (shortcut) {
            edit_shortcuts.add_shortcut(shortcut, action_follow_cell_off);
        }
    }

    function load_ipython_extension() {
        update_params();
        register_new_actions();
        register_keyboard_shortcuts();
        Jupyter.toolbar.add_buttons_group([action_go_to_runing_cell])
    }

    return {
        load_ipython_extension: load_ipython_extension,
    };

});
