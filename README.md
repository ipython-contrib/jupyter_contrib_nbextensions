ipython-notebook-extensions
===========================

Some experiment with statics files. 

## Usage

You need to add the folders here to your notebook static path.

Then you link in the libraries you want from your `custom.js` file.

For example, to add all the extensions here, edit the
``ipyton_notebook_config.py`` file in your IPython profile.

``ipython locate profile`` from the command line will find your current default
profile directory. Call that directory ``/path/to/your/profile``.

If you don't have the required `.py` file, issue a `$ ipython profile create [profilename]` to generate the default config files.


Add the following lines:

    PROFILES_PATH='/path/to/this/folder'
    extra_static_paths = ["{0}/{1}".format(PROFILES_PATH, sdir)
                        for sdir in (
                            'css_selector',
                            'slidemode',
                            'init_cell'
                        )]
    extra_static_paths.append('/path/to/your/profile/static')
    c.NotebookApp.extra_static_paths = extra_static_paths

The last few lines above add the `static` subfolder in your profile to the
static paths. Then you can create / edit the file `static/js/custom.js`, and
load the corresponding libraries by adding these lines:

    $.getScript('/static/js/css_selector.js')
    $.getScript('/static/js/slide_meta.js')
    $.getScript('/static/js/init_cell.js')

To labor the point, you will now have a file
`/path/to/your/profile/static/js/custom.js` with the contents above.

Every change to the IPython config file needs a server restart. If your
modifications only touch **already existing** js files, you only have to reload
the pages in the browser.
