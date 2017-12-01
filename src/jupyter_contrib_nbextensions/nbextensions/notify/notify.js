/*

*************************
Display Web Notifications
*************************

Add this file to $(ipython locate)/nbextensions/

*/

define([
  "jquery",
  "base/js/namespace",
  "require",
], function ($, Jupyter, requirejs) {
  "use strict";

  var params = {
    sticky: false,
    play_sound: false
  };
  var audio_file = "./notify.mp3";

  var current_time = function() {
    return new Date().getTime() / 1000;
  };

  var start_time = current_time();
  var min_time = 0;
  var enabled = false;
  var first_start = true;
  var busy_kernel = true;

  var add_permissions_list = function () {
    var ipython_toolbar = $('#maintoolbar-container');
    var label = $('<span/>').addClass("navbar-text permissions-list").text('Notify:');
    var select = $('<select/>')
                  .attr('id', 'permissions-select')
                  .attr('class', 'permissions-list form-control select-xs')
                  .append($('<option/>')
                  .attr('value', 'Disabled')
                  .text('Disabled'));
    ipython_toolbar.append(label).append(select);
    select.change(function() {
      var val = $(this).val();
      if (val == 'Disabled') {
        enabled = false;
      } else {
        enabled = true;
        min_time = val;
      }
      save_state();
    });
    // Add options in addition to the default, 'Disabled'
    // Options give the minimum kernel busy time in seconds after which a notification is displayed
    var presets = [0, 5, 10, 30];
    for (var i=0; i<presets.length; i++) {
      var name = presets[i];
      select.append($('<option/>').attr('value', name).text(name));
    }
    // Finally, restore the selected option if it was saved in notebook metadata
    restore_state();
  };

  var add_permissions_button = function () {
    if ($("#permissions-button").length === 0) {
      $(Jupyter.toolbar.add_buttons_group([
        Jupyter.keyboard_manager.actions.register ({
          'help'   : 'Grant Notification Permissions',
          'icon'   : 'fa-check',
          'handler': ask_permission,
        },'grant-notifications-permission', 'notify')
      ])).find('.btn').attr('id', 'permissions-button');
    }
  };

  var ensure_permission = function () {
    ask_permission();  // Asks for permission on notebook load, doesn't work in Chrome
    // If don't have permission now, add a button to the toolbar to let user request permission
    if (Notification && Notification.permission !== "granted") {
      add_permissions_button();
      add_permissions_list();
      $(".permissions-list").hide();
    } else if (Notification && Notification.permission === "granted") {
      add_permissions_list();
    }
  };

  var ask_permission = function () {
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
        // Wait for permission to be granted, then remove the permissions-button and show permissions-list
        if (Notification && Notification.permission === "granted" && $("#permissions-button").length > 0) {
          $("#permissions-button").remove();
          $(".permissions-list").show();
        }
      });
    }
  };

  var play_notification_sound = function(opts) {
    /**
     * NB: the Web Notification API specifies a mechanism for playing sound
     * with notifications. As of 2017-08-22, it is unsupported in all browsers.
     * This is a workaround. It should be updated to an implementation like
     * this when browser support is available:
     *
     *   opts["sound"] = requirejs.toUrl(audio_file);
     */
    try {
      var audio = new Audio(requirejs.toUrl(audio_file));
      audio.play();
    } catch(e) {
      console.log('HTML5 Audio not supported in browser.');
    }
  };

  var notify = function () {
    var elapsed_time = current_time() - start_time;
    if (enabled && !first_start && !busy_kernel && elapsed_time >= min_time) {
      var opts = {
        body: "Kernel is now idle\n(ran for " + Math.round(elapsed_time) + " secs)",
        icon: Jupyter.notebook.base_url + "static/base/images/favicon.ico",
        requireInteraction: params.sticky
      };
      if (params.play_sound) {
        play_notification_sound(opts);
      }
      var n = new Notification(Jupyter.notebook.notebook_name, opts);
      n.onclick = function(event){ window.focus(); }
    }
    if (first_start) {
      first_start = false;
    }
  };

  var load_state = function () {
    if (!Jupyter.notebook) return;

    if ("notify_time" in Jupyter.notebook.metadata) {
      min_time = Jupyter.notebook.metadata.notify_time;
      enabled = true;
    }
  };

  var save_state = function () {
    if (enabled) {
      if (Jupyter.notebook.metadata.notify_time !== min_time) {
        Jupyter.notebook.metadata.notify_time = min_time;
        Jupyter.notebook.set_dirty();
      }
    } else {
      if (Jupyter.notebook.metadata.hasOwnProperty('notify_time')) {
        delete Jupyter.notebook.metadata.notify_time;
        Jupyter.notebook.set_dirty();
      }
    }
  };

  var restore_state = function () {
    load_state();
    // Only proceed if the permissions selector is being shown
    if ($("#permissions-select").length > 0) {
      if (!enabled) {
        $("#permissions-select").val("Disabled");
      } else {
        $("#permissions-select").val(min_time);
      }
    }
  };

  var setup_notifier = function () {
    $([Jupyter.events]).on('kernel_starting.Kernel',function () {
      first_start = true;  // reset first_start status when restarting the kernel
    });

    $([Jupyter.events]).on('kernel_busy.Kernel',function () {
      busy_kernel = true;
      start_time = current_time();  // reset the timer
    });

    $([Jupyter.events]).on('kernel_idle.Kernel',function () {
      busy_kernel = false;  // Used to make sure that kernel doesn't go busy again within the timeout set below.
      setTimeout(notify, 500);
    });
  };

  var load_ipython_extension = function () {
    return Jupyter.notebook.config.loaded.then(function() {
      $.extend(true, params, Jupyter.notebook.config.data.notify);
      ensure_permission();
      setup_notifier();
    });
  };

  return {
    load_ipython_extension : load_ipython_extension
  };

});
