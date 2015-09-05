// a no scroll extension that add a button in the toolbar to 
// deactivate scolling of cell it the output is too long.
// rely and monkey patching private methods for the time beeig 
// and not reversible once the button is clicked.
//
// uncomment the line 
// // load_ext('noscroll.js') 
// in `custom.js` file
// 



IPython.toolbar.add_buttons_group(
    [
       {
            'label'   : 'No auto-output scrolling (Definitive until restart/reload of the page)',
            'icon'    : 'fa-close',
            'callback': function() {
                IPython.OutputArea.prototype._should_scroll = function (){return false}
            }
        }
    ]
);

