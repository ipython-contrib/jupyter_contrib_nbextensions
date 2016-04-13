JavaScript Tests
================

This directory includes regression tests, adapted from those in the jupyter
notebook.
The javascript tests depend on
[CasperJS](http://casperjs.org/),
which in turn requires a recent version of
[PhantomJS](http://phantomjs.org/).

The JavaScript tests are organized into subdirectories that match those in
`notebook/static` (`base', `notebook`, `services`, `tree`, etc.).

To run all of the JavaScript tests do:

```
python -m themysto.jstest
```

To run the JavaScript tests in a single subdirectory (`base` in this
case) do:

```
python -m themysto.jstest base
```

The file `util.js` contains utility functions for tests, including a path to
a running notebook server on localhost (http://127.0.0.1) with the port
number specified as a command line argument to the test suite. Port 8888 is
used if `--port=` is not specified. When you run these tests using `jstest`
you do not, however, have to start a notebook server yourself; that is done
automatically.
