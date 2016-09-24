Notebook extension structure
============================

The nbextensions are stored each as a separate subdirectory of
``src/jupyter_contrib_nbextensions/nbextensions``

Each notebook extension typically has it's own directory containing:

* ``thisextension/main.js``: javascript implementing the extension
* ``thisextension/main.css``: optional CSS
* ``thisextension/readme.md``: readme file describing the extension in markdown format
* ``thisextension/config.yaml``: file describing the extension to the ``jupyter_nbextensions_configurator`` server extension

The file names do not need to have the shown names, they can be choosen freely. This is an example for the `main.js` file:

.. code-block:: javascript

    define([
        'jquery',
        'base/js/namespace',
        'base/js/utils',
        'services/config'
    ], function (
        $,
        IPython,
        utils,
        configmod,
    ) {
        "use strict";

        // define default values for config parameters
        var params = {
            my_config_value : 100
        };

        // create config object to load parameters
        var base_url = utils.get_body_data("baseUrl");
        var config = new configmod.ConfigSection('notebook', {base_url: base_url});

        // update params with any specified in the server's config file
        var update_params = function() {
            for (var key in params) {
                if (config.data.hasOwnProperty(key))
                    params[key] = config.data[key];
            }
        };

        // will be called when the config parameters have been loaded
        config.loaded.then( function() {
            update_params();

        });

        function config_loaded_callback () {
            $.extend(true, params, config.data.thisextension);
        };

        // will be called when the extension is loaded
        var load_ipython_extension = function () {
            config.load(); // trigger loading config parameters

        };

        // return public methods
        return {
            load_jupyter_extension : load_jupyter_extension
        };
    });

And for the `config.yaml` file:

::

    Type: Jupyter Notebook Extension
    Compatibility: 4.x
    Name: thisextension
    Main: main.js
    Icon: icon.png
    Link: README.md
    Description: My super duper extension
    Parameters:
    - name: my_config_value
      description: A configuration parameter
      input_type: number
      min: -1
      step: 1
      default: 100

When supplying a `readme.md` file, please supply a main heading, as this will be linked in the generated documentation
at http://jupyter-contrib-nbextensions.readthedocs.io/en/latest/. This is a simple example for `readme.md`:

::

    This extension
    ==============

    How to use
    ----------
    Some description here.

    ![Screenshot image](screenshot.png)

    Internals
    ---------
    How this extension works.

