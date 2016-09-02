Hide all Input
==============
This extension allows hiding all codecells of a notebook. This can be achieved by clicking on the button toolbar:

![](hide_input_all_toggle_codecells.png)

Typically, all codecells are shown with their corresponding output:

![](hide_input_all_show.png)

Clicking on the "Toggle codecell display" toolbar button hides all codecells:

![](hide_input_all_hide.png)


Internals
---------

The codecell hiding state is stored in the metadata `IPython.notebook.metadata.hide_input`.
If it is set to `true`, all codecells will be hidden on reload.
