/* allow folding complete cell, if comment is in first line */

CodeMirror.registerHelper("fold", "firstline", function(cm, start) {
  var mode = cm.getMode(), Token = mode.lineComment;
  console.log("XX:",start);
  if (start.line == 0) {
  console.log("Line 0",start);
 
  var lineText = cm.getLine(start.line);
  var found = lineText.lastIndexOf(Token,0);
  console.log("lineText:",lineText);
  console.log("Found:",found);
  if (found == 0) {
  
  end =  cm.lastLine(); 
  console.log("Found firstline comment");
    return {from: CodeMirror.Pos(start.line, null),
          to: CodeMirror.Pos(end, null)}; 

  }
 }

return ;  
});
