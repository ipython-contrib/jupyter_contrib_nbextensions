

  CodeMirror.defineOption("cellstate", false, function(cm, val, old) {
    if (old && old != CodeMirror.Init) {
      cm.clearGutter(cm.state.cellState.options.gutter);
      cm.state.cellState = null;
      cm.off("gutterClick", onGutterClick);
      cm.off("change", onChange);
      cm.off("viewportChange", onViewportChange);
      cm.off("swapDoc", onChange);
    }
    if (val) {
      cm.state.cellState = new State(parseOptions(val));
      updateInViewport(cm);
      cm.on("gutterClick", onGutterClick);
      cm.on("change", onChange);
      cm.on("viewportChange", onViewportChange);
      cm.on("swapDoc", onChange);
    }
  });
