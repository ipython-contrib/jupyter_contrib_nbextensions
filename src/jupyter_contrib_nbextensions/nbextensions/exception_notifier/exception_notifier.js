define([
  'require',
  'jquery',
  'moment',
  'base/js/namespace',
  'base/js/events',
  'notebook/js/codecell',
  'notebook/js/outputarea',
  'services/config',
  ], function (
    requirejs,
    $,
    moment,
    Jupyter,
    events,
    outputarea,
    codecell) {
      var all_events = [
        'app_initialized.DashboardApp',
        'app_initialized.NotebookApp',
        'autosave_disabled.Notebook',
        'autosave_enabled.Notebook',
        'before_save.Notebook',
        'changed',
        'checkpoint_created.Notebook',
        'checkpoint_delete_failed.Notebook',
        'checkpoint_deleted.Notebook',
        'checkpoint_failed.Notebook',
        'checkpoint_restore_failed.Notebook',
        'checkpoint_restored.Notebook',
        'checkpoints_listed.Notebook',
        'collapse_pager',
        'command_mode.Cell',
        'command_mode.Notebook',
        'config_changed.Editor',
        'create.Cell',
        'delete.Cell',
        'draw_notebook_list.NotebookList',
        'edit_mode.Cell',
        'edit_mode.Notebook',
        'execute.CodeCell',
        'execution_request.Kernel',
        'expand_pager',
        'file_load_failed.Editor',
        'file_loaded.Editor',
        'file_renamed.Editor',
        'file_saved.Editor',
        'file_saving.Editor',
        'input_reply.Kernel',
        'kernel_autorestarting.Kernel',
        'kernel_busy.Kernel',
        'kernel_connected.Kernel',
        'kernel_connection_dead.Kernel',
        'kernel_connection_failed.Kernel',
        'kernel_created.Kernel',
        'kernel_created.Session',
        'kernel_dead.Kernel',
        'kernel_dead.Session',
        'kernel_disconnected.Kernel',
        'kernel_idle.Kernel',
        'kernel_interrupting.Kernel',
        'kernel_killed.Kernel',
        'kernel_killed.Session',
        'kernel_ready.Kernel',
        'kernel_reconnecting.Kernel',
        'kernel_restarting.Kernel',
        'kernel_starting.Kernel',
        'kernelspecs_loaded.KernelSpec',
        'list_checkpoints_failed.Notebook',
        'mode_changed.Editor',
        'no_kernel.Kernel',
        'notebook_copy_failed',
        'notebook_deleted.NotebookList',
        'notebook_load_failed.Notebook',
        'notebook_loaded.Notebook',
        'notebook_loading.Notebook',
        'notebook_read_only.Notebook',
        'notebook_renamed.Notebook',
        'notebook_restoring.Notebook',
        'notebook_save_failed.Notebook',
        'notebook_saved.Notebook',
        'open_with_text.Pager',
        'output_appended.OutputArea',
        'preset_activated.CellToolbar',
        'preset_added.CellToolbar',
        'rebuild.QuickHelp',
        'received_unsolicited_message.Kernel',
        'rendered.MarkdownCell',
        'resize',
        'resize-header.Page',
        'save_status_clean.Editor',
        'save_status_dirty.Editor',
        'select.Cell',
        'selected_cell_type_changed.Notebook',
        'send_input_reply.Kernel',
        'sessions_loaded.Dashboard',
        'set_dirty.Notebook',
        'set_next_input.Notebook',
        'shell_reply.Kernel',
        'spec_changed.Kernel',
        'spec_match_found.Kernel',
        'spec_not_found.Kernel',
        'trust_changed.Notebook',
        'unrecognized_cell.Cell',
        'unrecognized_output.OutputArea',
        'unregistered_preset.CellToolbar',
    ];
    
    "use strict";
  
    var CodeCell = codecell.CodeCell;

    var params = {
      sticky: true,
      play_sound: true
    };
    var audio_file = "./notify.mp3";
  
    var current_time = function() {
      return new Date().getTime() / 1000;
    };
  
    var play_notification_sound = function(opts) {
      try {
        var audio = new Audio(requirejs.toUrl(audio_file));
        audio.play();
      } catch(e) {
        console.log('HTML5 Audio not supported in browser.');
      }
    };
  
    var notify = function () {
        var opts = {
          body: "Exception",
          icon: Jupyter.notebook.base_url + "static/base/images/favicon.ico",
          requireInteraction: params.sticky
        };
        if (params.play_sound) {
          play_notification_sound(opts);
        }
    };
  
    function showNotification(evalue) {
      notify();
      const notification = new Notification("Exception Occurred", {
        body: evalue,
        icon: "https://www.iconfinder.com/data/icons/miscellaneous-67-mix/168/objection_convulsions_exception_slander_exclusion_denigration_mudslinging-512.png"
     });
    }
    function checkPermission() {
      if (Notification.permission === "granted") {
      events.on('execute.CodeCell', function(evt, data) {
        var outputs = data.cell.output_area.outputs;
        console.log("output", outputs);
        setTimeout(function() { 
          if ("traceback" in outputs[0]) {
              showNotification(data.cell.output_area.outputs[0].evalue);
          }
        }, 1000);
      });
     } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            showNotification();
          }
           console.log(permission);
        });
     }
    }
    var load_ipython_extension = function () {
      return Jupyter.notebook.config.loaded.then(function() {
        $.extend(true, params, Jupyter.notebook.config.data.notify);
        checkPermission();
      });
    };
  
    return {
      load_ipython_extension : load_ipython_extension
    };
  
  });