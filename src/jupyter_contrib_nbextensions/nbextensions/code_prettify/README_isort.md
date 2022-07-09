# Sort imports using isort

This nbextension sorts imports in notebook code cells.

Under the hood, it uses a call to the current notebook kernel to reformat the code. The conversion run by the kernel uses Python's package [isort](https://github.com/timothycrosley/isort) by [Timothy Edmund Crosley](https://github.com/timothycrosley).

The nbextension provides

- a toolbar button (configurable to be added or not)

**pre-requisites:** of course, you must have the corresponding package installed:

```
pip install isort [--user]
```

## Options

All options are provided by the [KerneExecOnCells library](kernel_exec_on_cell.js). There are a few nbextension-wide options, configurable using the [jupyter_nbextensions_configurator](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator) or by editing the `notebook` section config file directly. The options are as follows:

- `isort.add_toolbar_button`: Whether to add a toolbar button to transform the selected cell(s). Defaults to `true`.

- `isort.button_icon`:
  A font-awesome class defining the icon used for the toolbar button and actions.
  See [fontawesome] for available icon classes.
  Defaults to `fa-sort`.

- `isort.show_alerts_for_not_supported_kernel`:
  Whether to show alerts if the kernel is not supported.
  Defaults to `false`.

- `isort.show_alerts_for_errors`: Whether to show alerts for errors in the kernel calls. Defaults to `false`.

- `isort.button_label`: Toolbar button label text. Also used in the actions' help text. Defaults to `Sort imports with isort`.

- `isort.kernel_config_map_json`: The value of this key is a string which can be parsed into a json object giving the config for each kernel language.

## Internals

Under the hood, this nbextension uses the [kerneexeconcells library](kernel_exec_on_cell.js), a shared library for creating Jupyter nbextensions which transform code cell text using calls to the active kernel.

See the [shared README](README.md) and [kerneexeconcells library](kernel_exec_on_cell.js) for the internal model used by the nbextension.

[fontawesome]: https://fontawesome.com/icons
