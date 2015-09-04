This extension displays when the last execution of a cell occurred and how long it took. 

## Display

Every executed cell is extended with a new area, attached at the bottom of the input area, that displays when the user started the last execution of this cell. When the kernel finishes to execute a cell, this area is update with the duration. 

![](https://github.com/ipython-contrib/IPython-notebook-extensions/raw/master/wiki-images/execution-timings-box.png)

## Toggling

The timings area can be hide by double clicking on it or using the option in the cell menu. The menu toggle timings->All hides (resp. shows) all the possible timings area if the first cell is displayed (resp. hidden).

![](https://github.com/ipython-contrib/IPython-notebook-extensions/raw/master/wiki-images/execution-timings-menu.png)

## Internals
To be sure that the kernel is run intentionally by executing a codecell, codecell.prototype.execute() is overloaded and a new event 'ExecuteCell.ExecuteTime' is fired, that this extension catches to display the start time. We use the event 'status_idle.Kernel' to know when the kernel finished the execution of the cell. 

## Installation
Copy `ExecuteTime.{js,css}`, and add `require(['/static/custom/ExecuteTime.js'])` to `custom.js` in your profile's `/static/custom` directory, so it looks like this:
```javascript
$([IPython.events]).on('app_initialized.NotebookApp', function(){
  //... 
  require(['/static/custom/ExecuteTime.js'])
});
```

## TODO
The timings information could be stored into the notebook and displayed when it is loaded. Where these information should be stored is still to be decided (maybe in the metadata).
