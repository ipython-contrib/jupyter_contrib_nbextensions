ipython-notebook-extensions
===========================

Some experiment with statics files. 

## Usage

Add the following to your notebook_config

    c.NotebookApp.extra_static_paths = [
        '[path to this folder]/[extension_folder]',
        '[path to this folder]/css_selector',
        '[path to this folder]/slidemode'
        '[path to this folder]/init_cell'
        ]

Every change to the config need a server restart. If your modification only touch **already existing** js files, you only have to reload the pages.

link to the corresponding files in your `custom.js`, example 

    $.getScript('/static/js/css_selector.js')


