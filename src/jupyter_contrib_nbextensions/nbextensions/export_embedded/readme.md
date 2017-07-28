Export Embedded HTML
====================
This extension allows exporting an embedded HTML by simple click, (like: jupyter nbconvert --to htmlembedded notebook.ipynb)

Implementation Todos
====================
Since  Jupyter dispatches via Tornade to nbconvert.exporters.exporter_locator (which is deprecated)
we link to our fork of nbconvert (this will be no more necessary in the future)
-> replace htmlembedded -> with html_embed (which uses this repos rexporter!)
-> remove package requirement in setup
