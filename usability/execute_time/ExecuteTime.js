
//  Copyright (C) 2014  Jean-Christophe Jaskula
//
//  Distributed under the terms of the BSD License.
//----------------------------------------------------------------------------
//
// Execute timings - display when a cell has been executed lastly and how long it took
// A double click on the box makes it disappear

(function (IPython) {
    "use strict";

    var firstExecTime=null;
    var execCells=[];
    var toggle_all = null;

    var month_names = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    //["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    var day_names = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    //["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

    var date_fmt = function(date) {
        var dnames=day_names[date.getDay()] + "";
        var mon=month_names[date.getMonth()] + " ";
        var day=date.getDate() +" ";
        var year= date.getFullYear()+" ";

        var hour = date.getHours();
        hour = (hour == 0) ? 12 : hour;
        hour = (hour > 12) ? hour - 12 : hour;

        var min = date.getMinutes() + "";
        min = (min.length == 1) ? "0" + min: min;

        var a_p = (hour < 12) ? "AM" : "PM";

        return dnames+ ', ' + mon + day + year + 'at ' + hour + ":" + min + " " + a_p;
    }

    var executionStartTime = function (event) {
        var cell = IPython.notebook.get_selected_cell(); // get the selected cell
        if (cell instanceof IPython.CodeCell) {
            var ce=cell.element;

            var execTime=new Date();

            if (firstExecTime === null)
                firstExecTime=execTime;
            execCells.push([IPython.notebook.get_selected_index()]);

            var startMsg = 'Lastly executed on ' + date_fmt(execTime);

            var timing_area=ce.find(".timing_area");
            if (timing_area.length === 0) {
                var timing_area = $('<div/>').addClass('timing_area');

                timing_area.dblclick(toggleDisplay);

                ce.find(".input_area").css('border-radius','4px 4px 0 0');
                ce.find(".inner_cell").append(timing_area);
            }
            timing_area.text(startMsg);
        }
    };

    var executionEndTime = function(event) {
        if (firstExecTime === null) {
            return;
        }

        var cellNb=execCells.shift();

        var cell = IPython.notebook.get_cell(cellNb); // get the selected cell
        if (cell instanceof IPython.CodeCell) {

            var endExecTime=new Date();

            var UnixBeforeExec = Math.round(firstExecTime.getTime()/1000);
            var end = Math.round(endExecTime.getTime()/1000);
            var ET = (end-UnixBeforeExec);

            var hours=Math.floor(ET/3600);
            var minutes=Math.floor((ET-hours*3600)/60);
            var seconds=Math.floor(ET-hours*3600-minutes*60);
            var durationMsg = seconds + ' s';
            if (minutes) {
                durationMsg = minutes + ' min ' + durationMsg;
            }
            if (hours) {
                durationMsg = hours + ' h ' + durationMsg;
            }
            durationMsg = ' in ' + durationMsg;

            var ta=cell.element.find("div.timing_area");
            ta.html(ta.html() + durationMsg);
            ta.hide();
            ta.show('highlight', {color:'#b00000'}, 1000);

            if (!execCells.length) {
                firstExecTime=null;
            } else {
                firstExecTime=endExecTime;
            }
        }
    };

    var toggleDisplay = function() {
        var cell = IPython.notebook.get_selected_cell(); // get the selected cell
        if (cell instanceof IPython.CodeCell) {
            var ce=cell.element;

            var timing_area=ce.find(".timing_area");
            var vis=timing_area.is(':visible');
            if (vis) {
                ce.find(".input_area").css('border-radius','4px');
                timing_area.hide();
            } else {
                ce.find(".input_area").css('border-radius','4px 4px 0 0');
                timing_area.show();
            }
        }
    };

    $([IPython.events]).on('execution_request.Kernel',executionStartTime);
    $([IPython.events]).on('status_idle.Kernel', executionEndTime);
    $("head").append($("<link rel='stylesheet' href='/static/custom/usability/execute_time/ExecuteTime.css' type='text/css'  />"));

    var link_current=$("<a/>").text("Current").click(toggleDisplay);
    var link_all=$("<a/>").text("All").click(function(){
        var ncells = IPython.notebook.ncells()
        var cells = IPython.notebook.get_cells();
        for (var i=0; i<ncells; i++) {
            if (cells[i] instanceof IPython.CodeCell) {
                var timing_area=(cells[i]).element.find(".timing_area");
                var vis=timing_area.is(':visible');
                if (!timing_area.length)
                    continue;

                if (toggle_all === null)
                    toggle_all= vis;
                if (toggle_all) {
                    (cells[i]).element.find(".input_area").css('border-radius','4px');
                    timing_area.hide();
                } else {
                    (cells[i]).element.find(".input_area").css('border-radius','4px 4px 0 0');
                    timing_area.show();
                }
            }
        }
        toggle_all=null;
    });

    var cmenu=$("body").find("ul#cell_menu");
    var toggle_timings_menu=$("<li/>").addClass("dropdown-submenu").attr("id","toggle_timings").append($("<a/>").text("Toggle timings"));
    cmenu.append(toggle_timings_menu);
    var timings_submenu=$("<ul/>").addClass("dropdown-menu");
    var toggle_current_timings=$("<li/>").attr({id:"toggle_current_timings", title:"Toggle the current cell timings box"}).append(link_current);
    var toggle_all_timings=$("<li/>").attr({id:"toggle_all_timings", title:"Toggle all timings box"}).append(link_all);
    timings_submenu.append(toggle_current_timings).append(toggle_all_timings);
    toggle_timings_menu.append(timings_submenu);

    console.log('Execute Timings loaded');
}(IPython));
