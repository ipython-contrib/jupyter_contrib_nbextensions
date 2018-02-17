// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Hide or display solutions in a notebook

/*
December  6, 2017 @jcb91: use bootstrap 'hidden' class to play nicely with collapsible_headings
December 30, 2015: update to 4.1
Update december 22, 2015:
  Added the metadata solution_first to mark the beginning of an exercise. It is now possible to have several consecutive exercises.
Update october 21-27,2015:
1- the extension now works with the multicell API, that is
   - several cells can be selected either via the rubberband extension
   - or via Shift-J (select next) or Shift-K (select previous) keyboard shortcuts
    (probably Shit-up and down will work in a near future)
    Note: previously, the extension required the selected cells to be marked with a "selected" key in metadata. This is no more necessary with the new API.
Then clicking on the toolbar button transforms these cells into a "solution" which is hidden by default
** Do not forget to keep the Shift key pressed down while clicking on the menu button
(otherwise selected cells will be lost)**
2- the "state" of solutions, hidden or shown, is saved and restored at reload/restart. We use the "solution" metadata to store the current state.
3- A small issue (infinite loop when a solution was defined at the bottom edge of the notebook have been corrected)
4- Added a keyboard shortcut (Alt-S) [S for solution]
*/

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
        hotkey: 'Alt-S',
    };

    /**
     * handle click event
     *
     * @method click_solution_lock
     * @param evt {Event} jquery event
    */
    function click_solution_lock(evt) {
        var cell = IPython.notebook.get_selected_cell();
        var is_locked = cell.metadata.solution === 'hidden';
        cell.metadata.solution = is_locked ? 'shown' : 'hidden';
        element_set_locked(cell, !is_locked);
        cell = IPython.notebook.get_next_cell(cell);
        while (cell !== null && cell.metadata.solution !== undefined && !cell.metadata.solution_first) {
            cell.element.toggleClass('hidden', !is_locked);
            cell.metadata.solution = is_locked ? 'shown' : 'hidden';
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
        if (cell.metadata.solution_first) {
            remove_element(cell);
            delete cell.metadata.solution_first;
            while (cell !== null && cell.metadata.solution !== undefined && !cell.metadata.solution_first) {
                delete cell.metadata.solution;
                cell.element.removeClass('hidden');
                cell = IPython.notebook.get_next_cell(cell);
            }
        }
        else {
            cell.metadata.solution_first = true;
            cell.metadata.solution = 'hidden';
            add_element(cell);
            for (var k = 1; k < lcells.length; k++) {
                cell = lcells[k];
                cell.element.addClass('hidden');
                cell.metadata.solution = 'hidden';
            }
        }
    }

    /**
     *  Add a lock control to the given cell
     */
    function add_element(cell) {
        var ctrl = cell.element.find('.exercise');
        if (ctrl.length > 0) return ctrl;
        var locked = cell.metadata.solution === 'hidden';
        ctrl = $('<div class="exercise fa">')
            .prependTo(cell.element)
            .on('click', click_solution_lock);
        element_set_locked(cell, locked);
        return ctrl;
    }

    function remove_element(cell) {
        cell.element.find('.exercise').remove();
    }

    function element_set_locked(cell, locked) {
        return cell.element.find('.exercise')
            .toggleClass('fa-plus-square-o', locked)
            .toggleClass('fa-minus-square-o', !locked);
    }

    function refresh_exercises() {
        var in_exercise = false;
        IPython.notebook.get_cells().forEach(function(cell) {
            if (in_exercise && cell.metadata.solution !== undefined && !cell.metadata.solution_first) {
                cell.element.toggleClass('hidden', cell.metadata.solution  === 'hidden');
            } else {
                in_exercise = false;
            }
            if (!in_exercise && cell.metadata.solution !== undefined) {
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
            help    : 'Exercise: Create/Remove exercise',
            help_index: 'ht',
            icon    : 'fa-mortar-board',
            handler : create_remove_exercise
        }, 'create_remove_exercise', 'exercise');

        IPython.notebook.config.loaded.then(function() {
            $.extend(true, cfg, IPython.notebook.config.data);

            if (cfg.add_button) {
                IPython.toolbar.add_buttons_group([action_name]);
            }
            if (cfg.use_hotkey && cfg.hotkey) {
                var cmd_shrts = {};
                cmd_shrts[cfg.hotkey] = action_name;
                IPython.keyboard_manager.command_shortcuts.add_shortcuts(cmd_shrts);
            }
        }).catch(function(err) {
            console.warn('[exercise] error:', err);
        });
    }

    return {
        load_ipython_extension: load_ipython_extension,
    };
});
