ipython-notebook-extensions
===========================

Some experiment with statics files. 

## Usage

add the following to your notebook_config

    c.NotebookApp.extra_static_paths = [
        '[path to this folder]/[extension_folder]',
        '[path to this folder]/css_selector',
        '[path to this folder]/slidemode'
        ]

link to the corresponding files in your `custom.js`, example 

    $.getScript('/static/js/css_selector.js')

