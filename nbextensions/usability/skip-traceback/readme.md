This extension hides Python tracebacks and only displays the error type an name.

![](https://raw.github.com/ipython-contrib/IPython-notebook-extensions/master/wiki-images/skip-traceback.png)

After loading the extension, only newly executed cells are affected. Previous tracebacks will remain visible until the
 corresponding cell is executed again.

If you press the button on the toolbar with the exclamation mark, you can turn on tracebacks again.

Installation
============
Copy the `skip-exceptions` directory to a new `/nbextensions/usability/skip-exceptions` directory of your user's IPython
 directory and add
```javascript
IPython.load_extensions('usability/skip-exceptions/main.js')
```
to your `custom.js` file. Alternatively, you might want to use the `nbextensions` UI. Take a look at the general
 installation instructions in the Wiki if you are unsure how to proceed.

Internals
=========

This extensions works by overriding the `OutputArea.prototype.append_error` function, replacing it with a new function
 that only displays the error type and message.
