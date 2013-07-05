# IPython-nb-extensions

breakpoint - allow setting of breakpoints for notebook cells

hotkeys    - add PGUP / PGDOWN / HOME / END hotkeys for fast scrolling in codecells

slideshow  - add toolbar and visual hints to slideshow extension

history - add individual cell history (just a test...)

read-only  - allow codecells to be set read-only, so no editing or celle execution is possible

shift-tab - assign shift-tab to dedent

codefolding - fold code blocks using Alt-F

linenumbers - display line numbers in codecells using Alt-N

comment-uncomment - toggle comments in selected lines using Alt-C

The notebook extensions require patching IPython:

1. Add new event trigger for newly created cells in notebook.js
...
            if(this._insert_element_at_index(cell.element,index)){
                cell.render();
                this.select(this.find_cell_index(cell));
                this.set_dirty(true);
            }
            $([IPython.events]).trigger('insert_cell.Notebook', {cell: cell}); // ** NEW **
        }
        return cell;

    };
...

2. Correct CodeMirror.indentRangeFinder in CodeMirror/addon/indent-fold.js (https://github.com/marijnh/CodeMirror/pull/1122)

CodeMirror.indentRangeFinderA = function(cm, start) {
  var tabSize = cm.getOption("tabSize"), firstLine = cm.getLine(start.line);
  var myIndent = CodeMirror.countColumn(firstLine, null, tabSize);
  for (var i = start.line + 1, end = cm.lineCount(); i < end; ++i) {
    var curLine = cm.getLine(i);
    if ((CodeMirror.countColumn(curLine, null, tabSize) == myIndent)&&
          (CodeMirror.countColumn(cm.getLine(i-1), null, tabSize) > myIndent)){
      return {from: {line: start.line, ch: firstLine.length},
              to: {line: i, ch: curLine.length}};
    }
  }
};

3. Add line comment symbol to codemirror-ipython.js:
...
    var external = {
        lineComment: '#', // ** NEW **
        startState: function(basecolumn) {
...

4. Update CodeMirror/addon/fold/foldcolde.js from git repo

5. Update CodeMirror.defineExtension in CodeMirror/addon/comment/comment.js

  CodeMirror.defineExtension("uncomment", function(from, to, options) {
    if (!options) options = noOptions;
    var self = this, mode = CodeMirror.innerMode(self.getMode(), self.getTokenAt(from).state).mode;
    var end = Math.min(to.line, self.lastLine()), start = Math.min(from.line, end);
    if (to.ch == 0 && to.line > from.line) 
        {
        console.log(start, end);
        end--;
        }
    // Try finding line comments
    var lineString = options.lineComment || mode.lineComment, lines = [];
    var pad = options.padding == null ? " " : options.padding;
    lineComment: for(;;) {
      if (!lineString) break;
      for (var i = start; i <= end; ++i) {
        var line = self.getLine(i);
        var found = line.indexOf(lineString);
        if (found == -1 && (i != end || i == start) && nonWS.test(line)) break lineComment;
        if (i != start && nonWS.test(line.slice(0, found))) break lineComment;
        if (found > 1) break lineComment; // only mind comments at the start of the line
        lines.push(line);
      }
