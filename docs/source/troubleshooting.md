Troubleshooting
===============

If you are migrating from an older version of the contrib notebook extensions
repository, some old files might be left on your system. This can lead, for
example, to having all the nbextensions listed twice on the configurator page.


Cannot configure while the Jupyter notebook server is running
-------------------------------------------------------------
If you get this error message during installation, a running instance of the
Jupyter notebook server has been detected. You can check this by running

    jupyter notebook list

Sometimes the result can be incorrect. So if you are sure you have no notebook
servers running, you can force the notebook extension installation step using the
`--skip-running-check` prefix. For example:

    jupyter contrib nbextensions install --sys-prefix --skip-running-check

Removing Double Entries
-----------------------
The nbextensions from older versions will be located in the `nbextensions`
subdirectory in one of the `data` directories that can be found using the

    jupyter --paths

command. If you run your notebook server with the `--debug` flag, you should 
also be able to tell where the extra nbextensions are located from jupyter 
server logs produced by the `jupyter_nbextensions_configurator` serverextension:

    jupyter notebook --debug

To remove the extensions, use

`jupyter contrib nbextension uninstall --user`

and possibly the system-wide ones as well:

`jupyter contrib nbextension uninstall --system`

(though that may need admin privileges to write to system-level jupyter dirs, not sure on windows).

If the above doesn't work, the configurator serverextension should give warning logs about where duplicate files are found.

As a matter of interest, the possible install locations are, briefly:

 * user's jupyter data dir, on Windows ~\.jupyter
 * python sys.prefix jupyter data dir, in sys.prefix + /share/jupyter/nbextensions
 * system-wide jupyter data dir, OS-dependent, but in Windows 7, I think they should be in ~\AppData\jupyter\nbextensions
 
To find all possible paths, you can use the jupyter command:

    jupyter --paths

Generating Local Documentation
------------------------------

The documentation can be found online at readthedocs: 
    <http://jupyter-contrib-nbextensions.readthedocs.io/en/stable/>

If you want to create documentation locally, use

    $ tox -e docs

Display the documentation locally by navigating to `build/html/index.html`
in your browser. Or alternatively you may run a local server to display the docs.
In Python 3:

    python -m http.server 8000

Then, in your browser, go to `http://localhost:8000`.
   

If you want to avoid `tox` (if you are using conda for example), you can call `sphinx-build` directly: 

    sphinx-build -E -T -b readthedocs -c docs/source . docs/build


Then, start a local server

    python -m http.server 8000

And go to 'http://localhost:8000/build/docs/source/index.html'.
