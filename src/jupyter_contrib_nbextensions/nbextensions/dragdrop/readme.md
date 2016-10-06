Drag and Drop
=============

This IPython notebook extension allows dragging&dropping images from the desktop or other programs into a notebook. A new markdown cell is created below the currently selected cell and the image is embedded.
The notebook has been tested with Firefox and Chrome.

A demo video showing drag&drop of images is here:
http://youtu.be/buAL1bTZ73c


Configuration
-------------

A subdirectory can be specified, so all dropped images in the notebook  will be placed in this
subdirectory instead of the notebook location.


Internals
---------

The image will be uploaded to the server into the directory where your notebook resides. This means, the image is not copied into the notebook itself, it will only be linked to. The markdown cell in the notebook will contain this tag:

```html
<img  src="http://127.0.0.1:8888/notebooks/myimage.png"/>
```

The name of the image will be kept, if the drag&drop operation originates from a file system.
If no name can be determined, an unique ID is generated as name for the image.

If you run `nbconvert` to generate a HTML file, this image will remain outside of the html file. 
You can embedd all images by calling `nbconvert` with the option `--to html_embed` to call a 
custom exporter that will embed all images into the converted html file.

The subdirectory configuration is stored as parameter `dragdrop.subdirectory` in the JSON notebook
configuration.