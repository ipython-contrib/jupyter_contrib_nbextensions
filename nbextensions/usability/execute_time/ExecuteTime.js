
//  Copyright (C) 2014  Jean-Christophe Jaskula
//                2015  joshuacookebarnes@gmail.com
//
//  Distributed under the terms of the BSD License.
// ---------------------------------------------------------------------------
//
// Execution timings:
// display when a cell was last executed, and how long it took to run
// A double click on the timing box makes it disappear

define([
    'require',
    'jquery',
    'moment',
    'base/js/namespace',
    'base/js/events',
    'notebook/js/codecell'
], function (
    require,
    $,
    moment,
    Jupyter,
    events,
    codecell
) {
    'use strict';

    var CodeCell = codecell.CodeCell;

    function patch_CodeCell_get_callbacks () {
        console.log('[ExecuteTime] patching CodeCell.prototype.get_callbacks to insert an ExecuteTime shell.reply callback');
        var old_get_callbacks = CodeCell.prototype.get_callbacks;
        CodeCell.prototype.get_callbacks = function () {
            var callbacks = old_get_callbacks.apply(this, arguments);

            var cell = this;
            var prev_reply_callback = callbacks.shell.reply;
            callbacks.shell.reply = function (msg) {
                if (msg.msg_type === 'execute_reply') {
                    $.extend(true, cell.metadata, {
                        ExecuteTime: {
                            start_time: msg.metadata.started,
                            end_time: msg.header.date
                        }
                    });
                    var timing_area = update_timing_area(cell);
                    if ($.ui !== undefined) {
                        timing_area.stop(true, true).show(0).effect('highlight', {color: '#0B0'});
                    }
                }
                else {
                    console.log('msg_type', msg.msg_type);
                }
                return prev_reply_callback(msg);
            };
            return callbacks;
        };
    }

    function toggle_timing_display (cell, vis) {
        if (cell instanceof CodeCell) {
            var ce = cell.element;
            var timing_area = ce.find('.timing_area');
            if (timing_area.length > 0) {
                if (vis === undefined) {
                    vis = !timing_area.is(':visible');
                }
                timing_area.toggle(vis);
                return vis;
            }
        }
    }

    function toggle_timing_display_multiple (cells, vis) {
        for (var i = 0; i < cells.length; i++) {
            if (cells[i] instanceof CodeCell) {
                vis = toggle_timing_display(cells[i], vis);
            }
        }
    }

    function toggle_timing_display_selected () {
        toggle_timing_display_multiple(Jupyter.notebook.get_selected_cells());
    }

    function create_menu () {
        var menu_toggle_timings = $('<li/>')
            .addClass('dropdown-submenu')
            .append(
                $('<a/>').text('Toggle timings')
            )
            .appendTo($('#cell_menu'));

        var timings_submenu = $('<ul/>')
            .addClass('dropdown-menu')
            .appendTo(menu_toggle_timings);

        $('<li/>')
            .attr('title', 'Toggle the timing box for the selected cell(s)')
            .append(
                $('<a/>')
                    .text('Selected')
                    .on('click', toggle_timing_display_selected)
            )
            .appendTo(timings_submenu);

        $('<li/>')
            .attr('title', 'Toggle the timing box for all cells')
            .append(
                $('<a/>')
                    .text('All')
                    .on('click', function (evt) {
                        toggle_timing_display_multiple(Jupyter.notebook.get_cells());
                    })
            )
            .appendTo(timings_submenu);
    }

    function excute_codecell_callback (evt, data) {
        var cell = data.cell;
        cell.metadata.ExecuteTime = {start_time: moment().toISOString()};

        update_timing_area(cell);
    }

    function zeropad_time (val) {
        return ('0' + val).slice(-2);
    }

    function humanized_duration (duration_ms, item_count) {
        if (duration_ms < 1000) { // < 1s, show ms directly
            return Math.round(duration_ms) + 'ms';
        }

        var humanized = '';

        var days = Math.floor(duration_ms / 86400000);
        if (days) {
            humanized += days + 'd ';
        }
        duration_ms %= 86400000;

        var hours = Math.floor(duration_ms / 3600000);
        if (days || hours) {
            humanized += hours + 'h ';
        }
        duration_ms %= 3600000;

        var mins = Math.floor(duration_ms / 60000);
        if (days || hours || mins) {
            humanized += mins + 'm';
        }
        duration_ms %= 60000;

        var secs = duration_ms / 1000; // don't round!
        if (!days) {
            var decimals = (hours || mins > 1) ? 0 : (secs > 10 ? 1 : 2);
            humanized += (humanized ? ' ' : '') + secs.toFixed(decimals) + 's';
        }

        return humanized;
    }

    function update_timing_area (cell) {
        if (! (cell instanceof CodeCell) ||
                 !cell.metadata.ExecuteTime ||
                 !cell.metadata.ExecuteTime.start_time) {
            return $();
        }

        var start_time = moment(cell.metadata.ExecuteTime.start_time);

        var timing_area = cell.element.find('.timing_area');
        if (timing_area.length < 1) {
            var ia = cell.element.find('.input_area');
            // var radius = ia.css('border-radius');
            // ia.css('border-radius', radius + ' ' + radius + ' 0 0');

            timing_area = $('<div/>')
                .addClass('timing_area')
                .on('dblclick', function (evt) { toggle_timing_display(cell); })
                .appendTo(ia);
        }

        var msg = '';
        if (cell.metadata.ExecuteTime.end_time) {
            msg = start_time.format('[Last executed] YYYY-MM-DD HH:mm:ss');
            var exec_time = -start_time.diff(cell.metadata.ExecuteTime.end_time);
            // var exec_time = Math.round(Math.random() * 100000);

            if (exec_time >= 0) {
                msg += ' in ';
                msg += humanized_duration(exec_time);
            }
        }
        else {
            msg = start_time.format('[Execution queued at] YYYY-MM-DD HH:mm:ss');
        }
        timing_area.text(msg);
        return timing_area;
    }

    function add_css(url) {
        $('<link/>')
            .attr({
                rel: 'stylesheet',
                href: require.toUrl(url),
                type: 'text/css'
            })
            .appendTo('head');
    }

    function load_jupyter_extension () {
        // try to load jquery-ui
        if ($.ui === undefined) {
            require('jquery-ui', function ($) {}, function (err) {
                // try to load using the older, non-standard name (without hyphen)
                require(['jqueryui'], function ($) {}, function (err) {});
            });
        }
        if ($.ui === undefined) {
            console.log('[ExecuteTime] couldn\'t find jquery-ui, so no animations');
        }

        add_css('./ExecuteTime.css');

        patch_CodeCell_get_callbacks();
        events.on('execute.CodeCell', excute_codecell_callback);

        create_menu();

        // add any existing timing info
        Jupyter.notebook.get_cells().forEach(update_timing_area);
    }

    return {
        load_jupyter_extension : load_jupyter_extension,
        load_ipython_extension : load_jupyter_extension
    };
});
