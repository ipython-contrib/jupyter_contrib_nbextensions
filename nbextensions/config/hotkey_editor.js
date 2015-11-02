
define([
    'underscore',
    'bootstrap',
    'jquery',
    'base/js/dialog',
    'base/js/utils',
    'notebook/js/quickhelp',
    'codemirror/lib/codemirror'
], function(
    _,
    bs,
    $,
    dialog,
    utils,
    quickhelp,
    CodeMirror
){
    "use strict";

    // patch quickhelp with required definitions
    var platform = utils.platform;
    var special_case = { pageup: "PageUp", pagedown: "Page Down", 'minus': '-' };
    var humanize_map = quickhelp.humanize_map;
    if (humanize_map === undefined) {
        var mac_humanize_map = {
            // all these are unicode, will probably display badly on anything except macs.
            // these are the standard symbol that are used in MacOS native menus
            // cf http://apple.stackexchange.com/questions/55727/
            // for htmlentities and/or unicode value
            'cmd':'⌘',
            'shift':'⇧',
            'alt':'⌥',
            'up':'↑',
            'down':'↓',
            'left':'←',
            'right':'→',
            'eject':'⏏',
            'tab':'⇥',
            'backtab':'⇤',
            'capslock':'⇪',
            'esc':'esc',
            'ctrl':'⌃',
            'enter':'↩',
            'pageup':'⇞',
            'pagedown':'⇟',
            'home':'↖',
            'end':'↘',
            'altenter':'⌤',
            'space':'␣',
            'delete':'⌦',
            'backspace':'⌫',
            'apple':'',
        };
        var default_humanize_map = {
            'shift':'Shift',
            'alt':'Alt',
            'up':'Up',
            'down':'Down',
            'left':'Left',
            'right':'Right',
            'tab':'Tab',
            'capslock':'Caps Lock',
            'esc':'Esc',
            'ctrl':'Ctrl',
            'enter':'Enter',
            'pageup':'Page Up',
            'pagedown':'Page Down',
            'home':'Home',
            'end':'End',
            'space':'Space',
            'backspace':'Backspace',
        };
        if (platform === 'MacOS'){
            humanize_map = mac_humanize_map;
        } else {
            humanize_map = default_humanize_map;
        }
    }

    var quickhelp_patch_methods = {
        prettify : function (s) {
            s = s.replace(/-$/, 'minus'); // catch shortcuts using '-' key
            var keys = s.split('-');
            var k, i;
            for (i=0; i < keys.length; i++) {
                k = keys[i];
                if ( k.length == 1 ) {
                    keys[i] = "<code><strong>" + k + "</strong></code>";
                    continue; // leave individual keys lower-cased
                }
                if (k.indexOf(',') === -1){
                    keys[i] = ( special_case[k] ? special_case[k] : k.charAt(0).toUpperCase() + k.slice(1) );
                }
                keys[i] = "<code><strong>" + keys[i] + "</strong></code>";
            }
            return keys.join('-');
        },

        humanize_sequence : function(sequence) {
            var joinchar = ',';
            var hum = _.map(sequence.replace(/meta/g, 'cmd').split(','), quickhelp.humanize_shortcut).join(joinchar);
            return hum;
        },

        humanize_shortcut : function(shortcut) {
            var joinchar = '-';
            if (platform === 'MacOS'){
                joinchar = '';
            }
            var sh = _.map(shortcut.split('-'), quickhelp.humanize_key ).join(joinchar);
            return sh;
        },

        humanize_key: function (key) {
            if (key.length === 1) {
                key = key.toUpperCase();
            }
            return humanize_map[key.toLowerCase()] || key;
        }
    };
    $.extend(quickhelp, quickhelp_patch_methods);

    /**
     * @param keyname a keyname as normalized by normalizeKeyName
     * returns
     * - true for valid
     * - false for unrecognised/invalid
     * - undefined for incomplete
     */
    var validate_keyname = function(keyname, invalid_hotkeynames, incomplete_hotkeynames) {
        if (keyname === false) return false;
        if (invalid_hotkeynames === undefined) {
            invalid_hotkeynames = ['Esc', 'Cmd-R', 'Cmd-N'];
        }
        if (invalid_hotkeynames.indexOf(keyname) >= 0) return false;
        if (incomplete_hotkeynames === undefined) {
            incomplete_hotkeynames = [
                'Cmd', 'Ctrl', 'Alt', 'Shift', 'Cmd-Mod', 'Meta'
            ];
        }
        if (incomplete_hotkeynames.indexOf(keyname) >= 0) return undefined;
        return true;
    };


    /**
     * Pass it an option dictionary with the following properties:
     * - keyname
     * - title
     * - description
     * - default
     * - on_successful_close
     * - invalid_hotkeynames
     * - incomplete_hotkeynames
     */
    var HotkeyEditor = function(options) {

        // add a global style to get rid of bg on our pretty-printed code tags
        if ($('style#hotkey-editor-styles').length < 1) {
            $('html > head').append(
                $('<style id="hotkey-editor-styles"/>').html(
                    '#hotkey_editor_input_group code { background: transparent; }'
                )
            );
        }

        options = options || {};
        var keyname = options.keyname || '';
        var title = options.title || '';

        var input = $('<div class="input-group" id="hotkey_editor_input_group"/>');

        var btn = $('<a/>', {
            type: 'button',
            class: "btn btn-default hotkey-editor-capture-btn",
            'data-toggle': "button",
            'value': 'OFF'
        }).css('border-right', 'none').text('Capture');

        var textcontrol = $('<input/>', {
            type: 'text',
            class: "form-control hotkey-editor-text-input",
            placeholder: "type a key-combination, or click button & press one"
        }).val(keyname).on('change', function (event) {
            $(this).nextAll('.input-group-addon').html(
                quickhelp.prettify(quickhelp.humanize_shortcut($(this).val()))
            );
        });

        // http://jsfiddle.net/amma0py3/
        input.append($('<div class="input-group-btn"/>').append(btn));
        input.append(textcontrol);

        // feedback icon
        input.append(
            $('<span class="form-control-feedback"/>').css('right', '80px')
                .append($('<i class="fa fa-lg"/>'))
        );

        // pretty-display hotkey
        input.append(
            $('<div class="input-group-addon"/>').css('width', '80px').css(
                platform === 'MacOS' ?  {'letter-spacing': '1px'} : {}
            )
        );

        var set_validation_status = function (valid) {
            var form_group = textcontrol.closest('.form-group');
            var form_fdbck = form_group.find('i');
            var ok_button = $('.modal-footer button').first();

            if (valid === true) {  // valid
                form_group.removeClass('has-error has-warning').addClass('has-success');
                form_fdbck.removeClass('fa-remove fa-ellipsis-h').addClass('fa-check');
                ok_button.prop('disabled', false);
                return false;
            }
            if (valid === false) {  // invalid
                form_group.removeClass('has-success has-warning').addClass('has-error');
                form_fdbck.removeClass('fa-check fa-ellipsis-h').addClass('fa-remove');
            }
            else {  // not invalid, but incomplete
                form_group.removeClass('has-error has-success').addClass('has-warning');
                form_fdbck.removeClass('fa-check fa-remove').addClass('fa-ellipsis-h');
            }
            $('.modal-footer button').first().prop('disabled', true);
        };


        var key_capture_callback = function(event) {
            var keyname = CodeMirror.keyName(event);
            if (keyname === false)   //unrecognised
                textcontrol.val(
                    "Sorry, but I can't interpret that combo " +
                    "\u2639 \u2192 ");
            else {
                if (keyname !== 'Esc') textcontrol.val(keyname).change();
            }
            var valid = validate_keyname(keyname, options.invalid_hotkeynames,
                                         options.incomplete_hotkeynames);

            if (keyname !== 'Esc') set_validation_status(valid);
            return valid === false ? true : false; // allow invalid hotkeys to propagate
        };

        var stop_key_capture = function(event) {
            input.off('keydown');
            btn.removeClass('capturing').text('Capture');
            setTimeout(function(){ btn.blur(); }, 100);
        };

        var start_key_capture = function(event){
            textcontrol.focus();
            input.on('keydown', key_capture_callback);
            btn.addClass('capturing').text('Press your combo now!');
        };

        btn.on('click', function(event) {
            if (btn.hasClass('capturing')) stop_key_capture();
            else start_key_capture();
            return true;
        });

        input.on('blur', stop_key_capture);

        var body = $('<div class="form-group has-feedback"/>').append(
            $('<label/>').attr("for", "hotkey_editor_input_group").text(title)
        ).append(input);

        return dialog.modal({
            title: "Edit Hotkey",
            body: body,
            buttons : {
                "OK": {
                    class: "btn-primary",
                    click: function () {
                        if (options.on_successful_close) {
                            options.on_successful_close(textcontrol.val());
                        }
                    }
                },
                "Cancel": {}
            },
            open : function () {
                $(this).find('.hotkey-editor-capture-btn').click();
            }
        });
    };

    return {
        HotkeyEditor : HotkeyEditor,
        validate_keyname : validate_keyname,
        humanize_shortcut : quickhelp.humanize_shortcut,
        humanize_key : quickhelp.humanize_key,
        humanize_sequence : quickhelp.humanize_sequence
    };
});