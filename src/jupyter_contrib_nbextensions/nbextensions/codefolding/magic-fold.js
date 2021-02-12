/* allow folding of complete cell, if IPython magic symbol "%" is in first line */
CodeMirror.registerHelper("fold", "magic", function(cm, start) {
  var mode = cm.getMode(), Token = "%%";
  if (start.line == 0) {
      var lineText = cm.getLine(start.line);
      var found = lineText.lastIndexOf(Token,0);
      if (found == 0) {
        end =  cm.lastLine();
        return {from: CodeMirror.Pos(start.line, null),
              to: CodeMirror.Pos(end, null)};
        }
    }
    return ;
});
