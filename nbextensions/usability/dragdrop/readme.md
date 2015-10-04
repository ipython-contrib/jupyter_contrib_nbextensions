Description
===========

This IPython notebook extension allows dragging&dropping images and ipynb notebooks from the desktop or other programs into a notebook. 

For images, a new markdown cell is created below the currently selected cell and the image is embedded.
Supported types are `png`, `jpg`, `svg`.

A demo video showing drag&drop of images is here:
http://youtu.be/buAL1bTZ73c

Additionally, ipynb notebooks can be dropped into the current notebook. All content of the dragged source notebook will
be added below the current selected cell in the target notebook.


Internals
=========

A dropped image will be uploaded to the server into the directory where your notebook resides. This means, the image is not 
stored in the notebook itself, it will only be linked to. Storing images directly in a notebook is not recommended and
therefore has not been implemented.

The markdown cell in the notebook will contain this tag:

```html
<img  src="http://127.0.0.1:8888/notebooks/myimage.png"/>
```

It might be better to use the markdown tag `!()[]` in future. Please open a GitHub issue if you have thoughts on this.

To export notebooks containing images to HTML, it might be useful to embed the images directly. This can be achieved
using the `EmbedPostProcessor`. The postprocessor should be automatically installed with the IPython-notebook-extensions
package and is located in `/extensions/post_embedhtml.py`.

