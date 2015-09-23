This extension hides Python tracebacks and only displays the error type an name.

![](icon.png)

After loading the extension, only newly executed cells are affected. Previous tracebacks will remain visible until the
 corresponding cell is executed again.

If you press the button on the toolbar with the exclamation mark, you can turn on tracebacks again.


Installation
============
Copy the contents of the `skip-exceptions` directory to a new `/nbextensions/usability/skip-exceptions` directory of your user's IPython
directory.

```javascript
%%javascript
IPython.load_extensions('usability/skip-exceptions/main');
```

Or, for permanent installation instructions, please see the [readme](../../README.md),
or the [wiki](https://github.com/ipython-contrib/IPython-notebook-extensions/wiki).


Internals
=========

This extensions works by overriding the `OutputArea.prototype.append_error` function, replacing it with a new function
 that only displays the error type and message.
