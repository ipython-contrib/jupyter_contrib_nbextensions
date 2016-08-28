Limit_output Extension
======================

Description
-----------
This extension limits the number of characters a codecell will output as text or HTML.
This also allows to interrupt endless loops of print commands.

[![Demo Video](http://img.youtube.com/vi/U26ujuPXf00/0.jpg)](https://youtu.be/U26ujuPXf00)

You can set the number of characters using the ConfigManager:

```Python
from notebook.services.config import ConfigManager
cm = ConfigManager().update('notebook', {'limit_output': 1000})
```

or by using the [`jupyter_nbextensions_configurator`](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)

Internals
---------

Three types of messages are intercepted: `stream`, `execute_result`, `display_data`

For `stream`- type messages, the text string length is limited to `limit_output` number of characters
For other message types, `text/plain` and `text/html` content length is counted` and if either
exceeds `limit_output` charaters, will be truncated.
