This extension limits the number of characters a codecell can output as text. This also allows to interrupt endless loops.

[![Demo Video](http://img.youtube.com/vi/U26ujuPXf00/0.jpg)](https://youtu.be/U26ujuPXf00)

You can set the number of characters in the notebook extensions configration page or use the ConfigManager:
```Python
from IPython.html.services.config import ConfigManager
ip = get_ipython()
cm = ConfigManager(parent=ip)
cm.update('notebook', {"limit_output": 1000})
```
