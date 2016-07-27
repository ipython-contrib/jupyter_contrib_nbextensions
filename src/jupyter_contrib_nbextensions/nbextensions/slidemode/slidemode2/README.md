Legacy Slidemode
================

This folder contains the legacy slidemode

Put the following in your custom.js


```javascript
// Slidemode
require(['nbextensions/slidemode/main','base/js/events'], function(slidemode, events){
    events.on('app_initialized.NotebookApp', function(){
        slidemode.init();
    });
});
// end slidemode
```
