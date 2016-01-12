/*

*************************
Display Web Notifications
*************************

Add this file to $(ipython locate)/nbextensions/

*/

define(["require"], function (require) {
  "use strict";

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
      IPython.toolbar.add_buttons_group([
        {
          'label'   : 'Grant Notification Permissions',
          'icon'    : 'fa-check',
          'callback': ask_permission,
          'id'      : 'permissions-button'
        },
      ]);
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

  var notify = function () {
    var elapsed_time = current_time() - start_time;
    if (enabled && !first_start && !busy_kernel && elapsed_time >= min_time) {
      var n = new Notification(IPython.notebook.notebook_name, {body: "Kernel is now idle\n(ran for " + Math.round(elapsed_time) + " secs)"});
      n.onclick = function(event){ window.focus(); }
    }
    if (first_start) {
      first_start = false;
    }
  };

  var load_state = function () {
    if (!IPython.notebook) return;

    if ("notify_time" in IPython.notebook.metadata) {
      min_time = IPython.notebook.metadata.notify_time;
      enabled = true;
    }
  };

  var save_state = function () {
    if (enabled) {
      if (IPython.notebook.metadata.notify_time !== min_time) {
        IPython.notebook.metadata.notify_time = min_time;
        IPython.notebook.set_dirty();
      }
    } else {
      if (IPython.notebook.metadata.hasOwnProperty('notify_time')) {
        delete IPython.notebook.metadata.notify_time;
        IPython.notebook.set_dirty();
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
    $([IPython.events]).on('kernel_starting.Kernel',function () {
      first_start = true;  // reset first_start status when restarting the kernel
    });

    $([IPython.events]).on('kernel_busy.Kernel',function () {
      busy_kernel = true;
      start_time = current_time();  // reset the timer
    });

    $([IPython.events]).on('kernel_idle.Kernel',function () {
      busy_kernel = false;  // Used to make sure that kernel doesn't go busy again within the timeout set below.
      setTimeout(notify, 500);
    });
  };

  var load_ipython_extension = function () {
    ensure_permission();
    setup_notifier();
  };

  return {
    load_ipython_extension : load_ipython_extension
  };

});
