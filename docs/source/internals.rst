.. module:: jupyter_contrib_nbextensions.nbconvert_support

Notebook extension structure
============================

The nbextensions are stored in the repository each as a separate subdirectory of
`src/jupyter_contrib_nbextensions/nbextensions`.

Each notebook extension typically has its own directory named after the extension, containing:

 * `thisextension/thisextension.js` - javascript implementing the nbextension
 * `thisextension/thisextension.yml` - file describing the nbextension to the `jupyter_nbextensions_configurator` server extension
 * `thisextension/thisextension.css` - optional CSS file, which may be loaded by the javascript
 * `thisextension/README.md` - readme file describing the nbextension in markdown format

The file names do not need to have the shown names, they can be chosen freely, as long as they refer to each other using the appropriate names.
This is an example for the main `thisextension.js` file:

.. code-block:: javascript

    define([
        'require',
        'jquery',
        'base/js/namespace',
    ], function (
        requirejs
        $,
        Jupyter,
    ) {
        "use strict";

        // define default values for config parameters
        var params = {
            my_config_value : 100
        };

        var initialize = function () {
            // update params with any specified in the server's config file.
            // the "thisextension" value of the Jupyter notebook config's
            // data may be undefined, but that's ok when using JQuery's extend
            $.extend(true, params, Jupyter.notebook.config.thisextension);

            // add our extension's css to the page
            $('<link/>')
                .attr({
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: requirejs.toUrl('./thisextension.css')
                })
                .appendTo('head');
        };

        // The specially-named function load_ipython_extension will be called
        // by the notebook when the nbextension is to be loaded.
        // It mustn't take too long to execute however, or the notebook will
        // assume an error has occurred.
        var load_ipython_extension = function () {
            // Once the config has been loaded, do everything else.
            // The loaded object is a javascript Promise object, so the then
            // call return immediately. See
            // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
            // for details.
            return Jupyter.notebook.config.loaded.then(initialize);
        };

        // return object to export public methods
        return {
            load_ipython_extension : load_ipython_extension
        };
    });

And for the `thisextension.yml` file:

.. code-block:: yaml

    Type: Jupyter Notebook Extension
    Compatibility: 4.x, 5.x
    Name: This Extension
    Main: thisextension.js
    Icon: icon.png
    Link: README.md
    Description: My super duper extension
    Parameters:
    - name: thisextension.my_config_value
      description: Number of dupers to create
      input_type: number
      min: -1
      step: 1
      default: 100

For further details on the yaml file format, and the option types supported by the configurator, see the `jupyter_nbextension_configurator repo <https://github.com/jupyter-contrib/jupyter_nbextensions_configurator>`__.

When supplying a `README.md` file, please supply a main heading with the
nbextension's title, as this will be linked in the generated documentation at
`jupyter-contrib-nbextensions.readthedocs.io <http://jupyter-contrib-nbextensions.readthedocs.io/en/latest>`__.
This is a simple example for a `README.md`:

.. code-block:: markdown

    This extension
    ==============

    A quick summary of what this nbextension does.


    Usage
    -----

    A more detailed description can go here, maybe covering different variations of functionality, differences in versions or for different kernels etc.

    ![Screenshot image](screenshot.png)


    Options
    -------

    Some description of the different options the nbextension provides, what they do, and their default values

    Internals
    ---------

    How this extension works.

