Execute Time
============

This extension displays when the last execution of a code cell occurred, and
how long it took.

Every executed code cell is extended with a new area, attached at the bottom of
the input area, that displays the time at which the user sent the cell to the
kernel for execution.
When the kernel finishes executing the cell, the area is updated with the
duration of the execution.
The timing information is stored in the cell metadata, and restored on notebook
load.

![](execution-timings-box.png)


Toggling display
----------------

The timing area can be hidden by double clicking on it, or using the
`Cell -> Toggle timings -> Selected`
menu item.
The menu item
`Cell -> Toggle timings -> All`
hides (shows) all the timing areas in the notebook, if the first cell is
currently shown (hidden).

![](execution-timings-menu.png)


Limitations
-----------
For a reason I don't understand, when multiple cells are queued for execution,
the kernel doesn't send a reply immediately after finishing executing each
cell.
Some replies are delayed, and sent at the same time as later replies, meaning
that the output of a cell can be updated with its finished value, before the
notebook recieves the kernel execution reply.
For the same reason, you can see this in the fact that the star for an
executing cell can remain next to two cells at once, if several are queued to
execute together.
Since this extension uses the times in the kernel message (see internals,
below), and these remain correct, the timings displayed are still accurate,
but they may get displayed later due to this kernel issue.


Installation
------------
Install the master version of the jupyter_contrib_nbextensions repository as
explained in the
[readme](https://github.com/ipython-contrib/jupyter_contrib_nbextensions#installation)
or in the
[wiki](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/wiki/).

Then you can use the `/nbextensions` config page to enable/disable this
extension for all notebooks.

Internals
---------
The execution start and end times are stored in the cell metadata as ISO8601
strings, for example:

```json
{
	"ExecuteTime": {
    	"start_time": "2016-02-11T18:51:18.536796",
    	"end_time": "2016-02-11T18:51:35.806119"
	}
}
```

The times in the timing areas are formatted using the
[moment.js](http://momentjs.com/) library (already included as part of
Jupyter), but the durations use a custom formatting function, as
I ([@jcb91](https://github.com/jcb91))
couldn't find an existing one that I liked.

The event `execute.CodeCell` is caught in order to create a start time, and add
the timing area with its 'Execution queued at' message.
The extension again uses [moment.js](http://momentjs.com/) for formatting this
as an ISO string time.

To determine the execution time, the extension patches the Jupyter class
prototype `CodeCell.prototype.get_callbacks` from `notebook/js/codecell.js`.
This patch then patches the `callbacks.shell.reply` function returned by the
original `CodeCell.prototype.get_callbacks`, wrapping it in a function which
reads the `msg.header.date` value from the kernel message, to provide the
execution end time.
This is more accurate than creating a new time, which can be affected by
client-side variability.
In addition, for accurate timings, the start time is also revised using
the `msg.metadata.started` value supplied in the callback, which can be very
different from the time the cell was queued for execution (as a result of
other cells already being executed).
The kernel reply message times are already ISO8601 strings, so no conversion is
necessary, although again, [moment.js](http://momentjs.com/) is used for
parsing and diff'ing them.
