Allows notebook to have collapsible sections, separated by headings.

Any markdown heading cell (that is, one which begins with 1-6 `#` characters),
becomes collapsible, with a button in the margin of the header to
collapse/expand the cell:

![screenshot](screenshot.png)

The collapsed/expanded status of the headings is stored in the cell metadata,
and reloaded on notebook load.

In addition, the extension offers an optional toolbar button to collapse the
nearest heading to the curently selected cell, plus optional configurable
command-mode keyboard shortcuts to collapse and uncollapse headings, by default
set to left and right arrow keys.



Internals
=========

Heading cells which are collapsed have a value set in the cell metadata, so
that

```javascript
cell.metadata.collapsible_heading_collapsed = true
```

This could be used in an nbconvert preprocessor, but I
([@jcb91](https://github.com/jcb91)) haven't written one.
If you'd like one, feel free to get in touch to ask for it!
