/* allow folding of multi-line comments */
CodeMirror.registerHelper("fold", "blockcomment", function(cm, start) {
  var mode = cm.getMode(), Token = mode.lineComment;
  var lineText = cm.getLine(start.line);
  var found = lineText.lastIndexOf(Token,0);
  if (found == 0) {  // current line is a comment
    if (start.line == 0) {
      found = -1;
    } else {
      lineText = cm.getLine(start.line - 1);
      found = lineText.lastIndexOf(Token,0);
    }
    if (start.line == 0 || found != 0) {  // no previous comment line
      end = start.line;
      for (var i=start.line + 1; i<=cm.lastLine(); ++i) {  // final comment line
        lineText = cm.getLine(i);
        found = lineText.lastIndexOf(Token,0);
        if (found == 0) {
          end = i;
        } else {
          break;
        }
      }
      if(end > start.line) {
        return {from: CodeMirror.Pos(start.line, null),
                to: CodeMirror.Pos(end, null)};
      }
    }
  }
return ;
});
