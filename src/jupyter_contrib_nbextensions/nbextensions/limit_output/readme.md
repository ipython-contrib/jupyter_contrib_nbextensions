This extension limits the number of characters a codecell can output as text. This also allows to interrupt endless loops.

[![Demo Video](http://img.youtube.com/vi/U26ujuPXf00/0.jpg)](https://youtu.be/U26ujuPXf00)

You can set the number of characters using the ConfigManager:

```Python
from notebook.services.config import ConfigManager
cm = ConfigManager().update('notebook', {'limit_output': 1000})
```

or by using the [`jupyter_nbextensions_configurator`](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
