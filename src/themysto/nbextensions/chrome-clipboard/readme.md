Description
===========

This IPython notebook extension adds system clipboard actions for single or multiple cells. 
It allows cut/copy/paste operation of notebook cells and images. Images will be saved to the directory where the 
current notebook sits. There is currently no way to embed images in markdown cells, due to the google-caja sanitizer 
used to prevent malicous code execution. Multi-cell operation is possible with the latest Jupyter version, or using the `rubberband` extension in this repository.

A demo showing single-cell copy & paste operating in Chrome is available on youtube:
http://youtu.be/iU9dNe4vMUY

[![copy & paste extension on youtube](http://img.youtube.com/vi/iU9dNe4vMUY/0.jpg)](http://youtu.be/iU9dNe4vMUY "copy & paste extension on youtube")

*This extension works only for Chrome, as other browsers do not expose the system clipboard to Javascript.*


| Hotkey | Function                                  |
|--------|-------------------------------------------|
| CTRL+C | Copy cell to system clipboard             |
| CTRL+X | Cut cell and copy to system clipboard     |
| CTRL+V | Paste cell or image from system clipboard |


Installation
============

You can manually load the extension from within the IPython notebook:

```jupyter
%%javascript
IPython.load_extensions('usability/chrome_clipboard');
```

For installation instructions using the nbextensions config tool, please see the 
[Readme](../../config/readme.md)


Internals
=========

Regarding copying notebook cells over the clipboard, they are stored as mime-type `notebook-cell/json`.
