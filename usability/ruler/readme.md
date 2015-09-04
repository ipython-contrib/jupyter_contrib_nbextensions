This extension enables the Ruler CodeMirror feature

## Configuration

You can set the number of characters in the notebook extensions configration page or use the ConfigManager:
```Python
from IPython.html.services.config import ConfigManager
ip = get_ipython()
cm = ConfigManager(parent=ip)
cm.update('notebook', {"ruler_column": 80})
```
