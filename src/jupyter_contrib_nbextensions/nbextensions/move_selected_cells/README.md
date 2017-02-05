# Move selected cells

This is a quick (and dirty) extension - move up or down several selected cell*s*. Moving cells or series of cells via simple keystrokes can be super useful. 
Note: Alternatively, it is now possible to use the `keyboard_shortcut_editor` to bind the move cell up & move cell down actions to Alt-up and Alt-down (or anything else).

Initial version for Jupyter 4.0: a bit dirty because it would be better to act on DOM elements and write a correct move_cells() function. 
New version, updated to Jupyter 4.2+, now takes advantage of `Jupyter.notebook.move_selection_{down, up}` new functions


Keyboard shortcuts: *Alt-up* and *Alt-down* (works also with single cells!)

**Cell selection**: Cells can be selected using the rubberband (if this extension is enabled) or via Shift-up/Shift-down or Shift-K/Shift-J
