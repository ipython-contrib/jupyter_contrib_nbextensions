ipython-static-profiles
=======================

Some experiment with statics files. 

Description of this branch
==========================

Quick draft (again) of live slideshow for notebook for Fernando.

Install
=======

Clone this repo into  ~/.ipython_/profile_xxx/static/

Restart your notebook server.

Usage
=====


## setup the presentation 

 * Use new Cell Toolbar menu to select "slideshow" Preset. 

 * Make each cell you want to be the start of a new slide a "slide" cell.

 * Hide the Cell Toolbar. 

Fragment/Subslide/note... are not implemented in live mode yet. 

## Start the presentation

Click on the small presentation icon in the Main Toolbar.

Use 'play' to make the next slide appear 'fast-forward' and 'backward' are surely buggy.

Use the 'slide control' button on the top right to enable slide navigation through keyboard.

## Caveats

'stop' button does not 'stop', it put the presentation on Hold. 
Be sure to reload the page or to go to the end of the presentation or next press on 'start presentation' will resume where you were


## Usage

add the following to your notebook_config

    c.NotebookApp.extra_static_paths = [
        '[path to this folder]/[extension_folder]'
        '[path to this folder]/css_selector'
        ]
