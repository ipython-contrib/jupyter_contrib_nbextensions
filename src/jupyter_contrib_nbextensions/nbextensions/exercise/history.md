Exercise nbextension history
----------------------------

Update december 30, 2015:
(@jfbercher) Updated to jupyter notebook 4.1.x

Update december 22, 2015:
(@jfbercher)
  Added the metadata solution_first to mark the beginning of an exercise. It is now possible to have several consecutive exercises. 

October 21-27,2015: 
(@jfbercher)

1- the extension now works with the multicell API, that is
  - several cells can be selected either via the rubberband extension 
  - or via Shift-J (select next) or Shift-K (select previous) keyboard shortcuts
(probably Shit-up and down will work in a near future) 
Note: previously, the extension required the selected cells to be marked with a "selected" key in metadata. This is no more necessary with the new API.
Then clicking on the toolbar button turns these cells into a "solution" which is hidden by default ** Do not forget to keep the Shift key pressed down while clicking on the menu button (otherwise selected cells will be lost)** 
2- the "state" of solutions, hidden or shown, is saved and restored at reload/restart. We use the "solution" metadata to store the current state.
3- A small issue (infinite loop when a solution was defined at the bottom edge of the notebook have been corrected)
4- Added a keyboard shortcut (Alt-S with S for solution]

October-November 2014 (?):

Several versions (@juhasch)
