Ruler
=====
This extension enables the Ruler CodeMirror feature


Configuration
-------------

You can set the number of characters in the notebook extensions configration page or use the ConfigManager:

```Python
from IPython.html.services.config import ConfigManager
ip = get_ipython()
cm = ConfigManager(parent=ip)
cm.update('notebook', {"ruler_column": [80]})
```

#### Multiple Rulers ####
To specify multiple rulers, set the `ruler_column` to an list of values, for example

```Python
cm.update('notebook', {"ruler_column": [10, 20, 30, 40, 50, 60, 70, 80]})
```

A separate color and style can be specified for each ruler.

```Python
cm.update('notebook', {"color": ["#000000", "#111111", "#222222", "#333333", "#444444",
                                 "#555555", "#666666", "#777777", "#888888", "#999999"]})
```

Creating a repeating pattern for either color or style is as simple as giving a list shorter than the total number of rulers

```Python
cm.update('notebook', {"ruler_column": [10, 20, 30, 40, 50, 60, 70, 80]})
cm.update('notebook', {"color": ["#FF0000", "#00FF00", "#0000FF"]})
cm.update('notebook', {"style": ["dashed", "dotted"]})
```

will result in `red, green, blue, red, green, blue, red, green, blue, red` and alternating `dashed, dotted`

See [here](http://www.w3schools.com/cssref/pr_border-left_style.asp) for other line styles
