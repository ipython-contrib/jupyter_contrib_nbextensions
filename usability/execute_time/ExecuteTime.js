
//  Copyright (C) 2013  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------
//
// Cellstate - indicate if cell has been executed or modified after loading

(function (IPython) {
    "use strict";

    var firstExecTime=null;
    var execCells=[];
    var collapsed=false;

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

                var checkbox = $('<input/>', { type: 'checkbox', id: 'timing_chkbox', checked: 'checked' });
                var label = $('<label/>', { 'for': 'timing_chkbox', text: 'Toggle timings' });

                timing_area.dblclick(toggleDisplay);
                checkbox.change(toggleDisplay);

                ce.find(".input_area").css('border-radius','4px 4px 0 0');
                ce.find(".inner_cell").append(timing_area);
                ce.find(".celltoolbar").append(label).append(checkbox);
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
            var chkbox=ce.find("#timing_chkbox");
            if (chkbox.attr('checked')) {
                ce.find(".input_area").css('border-radius','4px');
                timing_area.hide();
                chkbox.attr('checked', false);
            } else {
                ce.find(".input_area").css('border-radius','4px 4px 0 0');
                timing_area.show();
                chkbox.attr('checked', true);
            }
        }
    };

    $([IPython.events]).on('execution_request.Kernel',executionStartTime);
    $([IPython.events]).on('status_idle.Kernel', executionEndTime);
    $("head").append($("<link rel='stylesheet' href='/static/custom/usability/execute_time/ExecuteTime.css' type='text/css'  />"));

    console.log('Execute Timings loaded');
}(IPython));
