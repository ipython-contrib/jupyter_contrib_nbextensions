# Table of Contents (2)

This is an update of "Table of Contents" extension, with the following new features:
- The toc window can now be moved on screen. The position and states (that is 'collapsed' and 'hidden' states) are remembered (actually stored in the notebook's metadata) and restored on the next session. The toc window can also be resized as needed and the new size is restored on the newt session. 
- Numerotation - The different headers in the notebook can be automatically numbered (with automatic update)
- Toc cell - A "toc cell" can be created at top of the notebook and its contents automatically updated. This cell can be moved elsewhere in the notebook andd its position will be remembered and restored. 

Two links have been added to the toc window in order to toggle numerotation and toc cell. 
   - the "n" link toggles automatic numerotation of all header lines
   - the "t" link toggles a toc cell in the notebook, which contains the actual table of contents, possibly with the numerotation of the different sections. 

- Inital configuration (applied when creating a new notebook) can be specified in the /nbextensions tab. Thenafter, configuration will be stored in the notebook itself. 

# Testing 
- At loading of the notebook, loading of the configuration and initial rendering of the table of contents was fired on the event "notebook_loaded.Notebook". Curiously, it happened that this event was either not always fired or detected. Thus I rely here on a combination of  "notebook_loaded.Notebook" and "kernel_ready.Kernel" instead. Because of that, I propose to not overwrite toc and I put the extension in "testing" to avoid any possible/unknown side effect, though it works nicely for me. 
- The present extension also includes a small workaround for https://github.com/ipython-contrib/IPython-notebook-extensions/issues/429
