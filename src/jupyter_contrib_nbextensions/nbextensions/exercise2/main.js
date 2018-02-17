// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Hide or display solutions in a notebook

// dec 6, 2017 @jcb91: use bootstrap 'hidden' class to play nicely with collapsible_headings
// december 30, 2015: update to notebook 4.1.x
// updated on december 22, 2015 to allow consecutive exercises
// exercise2: built by @jfbercher from an earlier work by @junasch october 2015) - see readme.md

define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
], function(IPython, $, requirejs, events) {
    "use strict";

    var cfg = {
        add_button: true,
        use_hotkey: true,
        hotkey: 'Alt-D',
    };

    /**
     * handle click event
     *
     * @method click_solution_lock
     * @param evt {Event} jquery event
    */
    function click_solution_lock(evt) {
        var cell = IPython.notebook.get_selected_cell();
        var is_locked = cell.metadata.solution2 === 'hidden';
        cell.metadata.solution2 = is_locked ? 'shown' : 'hidden';
        element_set_locked(cell, !is_locked);
        cell = IPython.notebook.get_next_cell(cell);
        while (cell !== null && cell.metadata.solution2 !== undefined && !cell.metadata.solution2_first) {
            cell.element.toggleClass('hidden', !is_locked);
            cell.metadata.solution2 = is_locked ? 'shown' : 'hidden';
            cell = IPython.notebook.get_next_cell(cell);
        }
    }

    /**
     * Create or Remove an exercise in selected cells
     *
     * @method create_remove_exercise
     *
     */
    function create_remove_exercise() {
        var lcells = IPython.notebook.get_selected_cells();
        // It is possible that no cell is selected
        if (lcells.length < 1) {
            alert("Exercise extension:  \nPlease select some cells...");
            return;
        }

        var cell = lcells[0];
        if (cell.metadata.solution2_first) {
            remove_element(cell);
            delete cell.metadata.solution2_first;
            while (cell !== null && cell.metadata.solution2 !== undefined && !cell.metadata.solution2_first) {
                delete cell.metadata.solution2;
                cell.element.removeClass('hidden');
                cell = IPython.notebook.get_next_cell(cell);
            }
        }
        else {
            cell.metadata.solution2_first = true;
            cell.metadata.solution2 = 'hidden';
            add_element(cell);
            for (var k = 1; k < lcells.length; k++) {
                cell = lcells[k];
                cell.element.addClass('hidden');
                cell.metadata.solution2 = 'hidden';
            }
        }
    }

    /**
     *  Add a lock control to the given cell
     */
    var cbx = 0;
    function add_element(cell) {
        var ctrl = cell.element.find('.exercise');
        if (ctrl.length > 0) return ctrl;
        var locked = cell.metadata.solution2 === 'hidden';
        cell.element.css('flex-wrap', 'wrap');
        cbx += 1;
        ctrl = $([
            '<div class="exercise exercise2">',
            '  <div class="prompt"></div>',
            '  <div class="onoffswitch">',
            '    <input class="onoffswitch-checkbox" type="checkbox" id="myCheck' + cbx + '">',
            '    <label class="onoffswitch-label" for="myCheck' + cbx + '">',
            '      <div class="onoffswitch-inner"></div>',
            '      <div class="onoffswitch-switch"></div>',
            '    </label>',
            '  </div>',
            '</div>'
        ].join('\n'))
            .appendTo(cell.element);
        ctrl.find('input')
            .on('click', click_solution_lock);
        element_set_locked(cell, locked);
        return ctrl;
    }

    function remove_element(cell) {
        cell.element.find('.exercise').remove();
    }

    function element_set_locked(cell, locked) {
        return cell.element.find('.exercise')
            .prop('checked', !locked);
    }

    function refresh_exercises() {
        var in_exercise = false;
        IPython.notebook.get_cells().forEach(function(cell) {
            if (in_exercise && cell.metadata.solution2 !== undefined && !cell.metadata.solution2_first) {
                cell.element.toggleClass('hidden', cell.metadata.solution2  === 'hidden');
            } else {
                in_exercise = false;
            }
            if (!in_exercise && cell.metadata.solution2 !== undefined) {
                in_exercise = true;
                add_element(cell);
            }
        });
    }

    function load_ipython_extension() {
        // add css
        $('<link rel="stylesheet" type="text/css">')
            .attr('href', requirejs.toUrl('./main.css'))
            .appendTo('head');

        // Hide/display existing solutions at startup
        events.on('notebook_loaded.Notebook', refresh_exercises);
        if (IPython.notebook._fully_loaded) refresh_exercises();

        var action_name = IPython.keyboard_manager.actions.register({
            help      : 'Exercise2: Create/Remove exercise',
            help_index: 'ht',
            icon      : 'fa-toggle-on',
            handler   : create_remove_exercise,
        }, 'create_remove_exercise', 'exercise2');

        return IPython.notebook.config.loaded.then(function() {
            $.extend(true, cfg, IPython.notebook.config.data.exercise2);

            if (cfg.add_button) {
                IPython.toolbar.add_buttons_group([action_name]);
            }
            if (cfg.use_hotkey && cfg.hotkey) {
                var cmd_shrts = {};
                cmd_shrts[cfg.hotkey] = action_name;
                IPython.keyboard_manager.command_shortcuts.add_shortcuts(cmd_shrts);
            }
        }).catch(function(err) {
            console.warn('[exercise2] error:', err);
        });
    }

    return {
        load_ipython_extension: load_ipython_extension,
    };
});
