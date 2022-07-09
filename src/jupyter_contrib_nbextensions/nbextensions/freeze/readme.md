# Freeze

This extension allows to make cells read-only or frozen. It provides three buttons:
* unlock
* read-only
* frozen


For **code-cells**:<br>
_read-only_:  it can be executed, but its input cannot be changed.<br>
_frozen_: It cannot be either altered or executed.

For **markdown-cells**:<br>
_read-only_: It's input can be viewed by double-clicking on it, but cannot be changed.<br>
_frozen_:  Input cannot be viewed by double-clicking.

To change the state of a selected cell, press the corresponding button.

The individual cell's state is stored in its metadata and is applied to the cell if the extension is loaded.

## Internals

The _read-only_ state is stored in the `cell.metadata.editable` attribute. Cells are editable by default.
The _frozen_ state is stored in the `cell.metadata.run_control.frozen`attribute.
