# Notebook web notifications

Jupyter notebook extension to display a web notification to notify you when the
kernel becomes idle.
This can be useful when running tasks that take more than a couple of seconds
to complete.

The extension has been tested with the most recent versions of Firefox, Chrome
and Safari.

Initially, a button to request notification permissions is shown in the toolbar.
After notification permissions have been granted, this button is replaced by a
dropdown menu with five choices: Disabled, 0, 5, 10 and 30.
To activate notifications, select a minimum kernel busy time required to
trigger a notification (e.g. if selecting 5, a notification will only be shown
if the kernel was busy for more than 5 seconds). The selection is saved in the
notebook's metadata and restored when the notebook is re-opened.

You may configure the plugin so that notifications require manual dismissal
before disappearing. Browser support is limited, see
[here](https://developer.mozilla.org/en-US/docs/Web/API/notification/requireInteraction)
to check if your browser supports this. You may also configure the plugin so
that notifications play a sound.

![notification](notification.png "notification")


## Original Source
This extension originally comes from [@sjpfenniger](https://github.com/sjpfenninger)'s [GitHub repository](https://github.com/sjpfenninger/ipython-extensions).

## Credits

This extension contains sounds created by RSilveira_88 on fresound.org, licensed
under the CC-BY 3.0 License. Modifications by morrisjim. You may find the
modified version [here](https://freesound.org/people/morrisjm/sounds/268756/) and
the original [here](https://freesound.org/people/RSilveira_88/sounds/216306/).

## License

The MIT License (MIT)

Copyright (c) 2014 Stefan Pfenninger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
