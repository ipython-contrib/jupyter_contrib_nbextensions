define([
    'base/js/namespace'
], function(
    Jupyter
) {
    function load_ipython_extension() {

        var handler = function () {
            var curUrl = window.location.href;
            var rgx = curUrl.match("\/user\/.*?(?=\/)");
            var editedUrl = curUrl.replace(rgx,"/hub/user-redirect");
            console.log(editedUrl)
            navigator.clipboard.writeText(editedUrl)
                .then(() => alert('the URL have been copied to clipboard'));
        };

        var action = {
            icon    : 'fa-share-alt', // a font-awesome class used on buttons, etc
            help    : 'Copy Shareable Link to Clipboard',
            handler : handler
        };
        var prefix = 'shareLink';
        var action_name = 'share-link';

        var full_action_name = Jupyter.actions.register(action, action_name, prefix); // returns 'custom_extension:share-link'
        Jupyter.toolbar.add_buttons_group([full_action_name]);
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});