# Table of Contents (2)

## Description and main features

The toc2 extension enables to collect all running headers and display them in a floating window, as a sidebar or with a navigation menu. The extension is also draggable, resizable, collapsable, dockable and features automatic numerotation with unique links ids, and an optional toc cell. Sections of currently selected/edited or running cells are highlighted in the toc. Some minor diplay tweaks are also available (moving header tile/menus, widening cells); Finally, the toc can preserved when exporting to html.

#### First demo:
![](demo.gif)

#### Second demo:
![](demo2.gif)

The table of contents is automatically updated when modifications occur in the notebook. The toc window can be moved and resized. It can be docked as a sidebar or dragged from the sidebar into a floating window. The table of contents can be collapsed or the window can be completely hidden. The navigation menu can be enabled/disabled via the nbextensions configuration utility. It can also be resized. The position, dimensions, and states (that is 'collapsed' and 'hidden' states) are remembered (actually stored in the notebook's metadata) and restored on the next session. The toc window also provides two links in its header for further functionalities:

- the "n" link toggles automatic numerotation of all header lines
- the "t" link toggles a toc cell in the notebook, which contains the actual table of contents, possibly with the numerotation of the different sections. 

The state of these two toggles is memorized and restored on reload. 

![](image.png) 

## Configuration
The initial configuration can be given using the IPython-contrib nbextensions facility. It includes:

- Display Table of Contents as a sidebar (otherwise as a floating window; default: true) 
- The maximum depth of headers to display on toc (with a default of 4)
- The state of the toc cell (default: false, ie not present)
- Add a navigation menu (default: true)
- Widening the display area to fit the browser window (may be useful with sidebar option; default: true)    
- The numbering of headers (true by default)
- Moving header title and menus on the left (default: true)
- Customization of highlighting the title of currently selected/running sections.  

The differents states and position of the floating window have reasonable defaults and can be modfied per notebook). 

## Export
It is possible to export (most of) table of contents functionalities to html. The idea is to link a relevant part of the javascript
extension and the css, and add a small script in the html file. This is done using a template by
```
jupyter nbconvert FILE.ipynb --template toc
```
or 
```
jupyter nbconvert FILE.ipynb --template toc2
```
An exporter is also available. It is now possible to export to html with toc by 
```
jupyter nbconvert --to html_toc FILE.ipynb 
```
If you also use latex_envs, you can embed both functionalities while exporting with 
```
jupyter nbconvert --to html_with_toclenvs FILE.ipynb 
```

For the first template (toc), the files toc2.js and main.css (originally located in `<python site-packages>/jupyter_contrib_nbextensions/nbextensions/toc2`)
must reside in the same directory as intended for the html file.
In the second template, these files are linked to the
`ipython-contrib/jupyter_contrib_nbextensions` github website.
Export configuration (parameters) shall be edited directly in the template
files (in templates directory `<python site-packages>/jupyter_contrib_nbextensions/templates`).
An option "Save as HTML (with toc)" is also provided in the File menu and
enables the direct conversion of the actual notebook.
This option requires the IPython kernel and is not present with other kernels.

 
## Testing 
- At loading of the notebook, configuration and initial rendering of the table of contents were fired on the event "notebook_loaded.Notebook". It happens that the extension is sometimes loaded *after* this event. I now rely  on a direct rendering at load and on a combination of  "notebook_loaded.Notebook" and "kernel_ready.Kernel". 

- This extension also includes a quick workaround as described in [#429](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/429)

## History

- This extension was adapted by minrk in [minrk/ipython_extensions](https://github.com/minrk/ipython_extensions)
  from [gist.github.com/magican/5574556](https://gist.github.com/magican/5574556)
- Added to the ipython-contrib/jupyter_contrib_nbextensions repo by @JanSchulz
- @juhasch, automatic update on markdown rendering, 
- @JanSchulz, enable maths in headers links
- @jfbercher december 06, 2015 -- Big update: automatic numbering, toc cell, window dragging, configuration parameters
- @jfbercher december 24, 2015 -- nested numbering in toc-window, following the fix by [@paulovn](https://github.com/minrk/ipython_extensions/pull/53) in @minrk's repo. December 30-31, updated config in toc2.yaml to enable choosing the initial visible state of toc_window via a checkbox ; and now resizable. 
- @slonik-az february 13, 2016. Rewritten toc numberings (more robust version), fixed problems with skipped heading levels, some code cleanup
- @jfbercher february 21, 2016. Fixed some issues when resizing the toc window. Now avoid overflows, clip the text and add a scrollbar. 
- @jfbercher february 22, 2016. Add current toc number to headings anchors. This enable to get unique anchors for recurring headings with the same text. An anchor with the original ID is still created and can be used (but toc uses the new ones!). It is also possible to directly add an html anchor within the heading text. This is taken into account when building toc links (see comments in code). 
- @jfbercher april 29, 2016. Triggered by @cqcn1991, cf [discussion here](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/532),  add a sidebar option. The floating toc window can be dragged and docked as a left sidebar. The sidebar can be dragged out as a floating window. These different states are stored and restored when reloading the notebook. Add html export capability via templates toc.tpl and toc2.tpl (see above).
- @jfbercher may 04, 2016. Added a "Save as HTML with toc" menu. Added a new "Navigate" menu with presents the contents of the toc. Changed default styling for links in tocs. 
- @jfbercher july 28, 2016. A dedicated exporter was added.  It is now possible to export to html with toc by  `jupyter nbconvert --to html_toc FILE.ipynb`
- @jfbercher september 21, 2016. Fixed empty size of navigation menu (if no resize had occur). Changed system/notebook configuration parameters storing, loading and merging.
- @jfbercher november 16, 2016. 
     - Fixed saving issue due to a race condition in loading/writing metadata; see issues [#1882](https://github.com/jupyter/notebook/issues/1882#issuecomment-260671282) and [#762](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/762)
     - As suggested by @dinya in [#791](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/791), added highlighting of the section that contains the currently edited/selected/executing cell. Colors can be customized by changing `.toc-item-highlight-select` and `.toc-item-highlight-execute` classes in css. 
     -[update nov 23]. As suggested by @jcb91, the highlight colors can now be configured via the nbextensions--configurator, instead of changing the css.  
- @jfbercher, february 2017.
     - Threshold (number of headings levels in toc)taken globally as requested in #646 (if it exists, otherwise default)
     - Make toc2 template inherits from nbextensions template, as mentioned in #847
     - On header/menu/toolbar resize (resize-header.Page event), resize toc2 sidebar  
     - On 'toggle-all-headers' event from `hide_menubar` extension, resize toc2 sidebar
     - Remove MathJax preview in headers and links -- addresses (issue 14 in latex_envs)[https://github.com/jfbercher/jupyter_latex_envs/issues/14]
     - Added a parameter to enable/disable cell widening (which is useful when sideBar is on) - default is to widen - address #871
     - Updated README to please @KadeG in #871

     
