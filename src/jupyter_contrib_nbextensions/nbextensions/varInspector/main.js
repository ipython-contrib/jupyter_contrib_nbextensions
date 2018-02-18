define([
    'require',
    'jquery',
    'base/js/namespace',
    'base/js/events',
    'notebook/js/codecell'
], function(
    requirejs,
    $,
    Jupyter,
    events,
    codecell
) {
    "use strict";

    var mod_name = "varInspector";
    var log_prefix = '[' + mod_name + '] ';


    // ...........Parameters configuration......................
    // define default values for config parameters if they were not present in general settings (notebook.json)
    var cfg = {
        'window_display': false,
        'cols': {
            'lenName': 16,
            'lenType': 16,
            'lenVar': 40
        },
        'kernels_config' : {
            'python': {
                library: 'var_list.py',
                delete_cmd_prefix: 'del ',
                delete_cmd_postfix: '',
                varRefreshCmd: 'print(var_dic_list())'
            },
            'r': {
                library: 'var_list.r',
                delete_cmd_prefix: 'rm(',
                delete_cmd_postfix: ') ',
                varRefreshCmd: 'cat(var_dic_list()) '
            }
        },
        'types_to_exclude': ['module', 'function', 'builtin_function_or_method', 'instance', '_Feature']
    }



    //.....................global variables....


    var st = {}
    st.config_loaded = false;
    st.extension_initialized = false;
    st.code_init = "";

    function read_config(cfg, callback) { // read after nb is loaded
        var config = Jupyter.notebook.config;
        config.loaded.then(function() {
            // config may be specified at system level or at document level.
            // first, update defaults with config loaded from server
            cfg = $.extend(true, cfg, config.data.varInspector);
            // then update cfg with some vars found in current notebook metadata
            // and save in nb metadata (then can be modified per document)

            // window_display is taken from notebook metadata
            if (Jupyter.notebook.metadata.varInspector) {
                if (Jupyter.notebook.metadata.varInspector.window_display)
                    cfg.window_display = Jupyter.notebook.metadata.varInspector.window_display;
            }

            cfg = Jupyter.notebook.metadata.varInspector = $.extend(true,
            cfg, Jupyter.notebook.metadata.varInspector);       

            // but cols and kernels_config are taken from system (if defined)
            if (config.data.varInspector) {
                if (config.data.varInspector.cols) {
                    cfg.cols = $.extend(true, cfg.cols, config.data.varInspector.cols);  
                }
                if (config.data.varInspector.kernels_config) {
                    cfg.kernels_config = $.extend(true, cfg.kernels_config, config.data.varInspector.kernels_config);  
                }
            }

            // call callbacks
            callback && callback();
            st.config_loaded = true;
        })
        return cfg;
    }

    var sortable;

    function toggleVarInspector() {
        toggle_varInspector(cfg, st)
    }

    var varInspector_button = function() {
        if (!Jupyter.toolbar) {
            events.on("app_initialized.NotebookApp", varInspector_button);
            return;
        }
        if ($("#varInspector_button").length === 0) {
            $(Jupyter.toolbar.add_buttons_group([
                Jupyter.keyboard_manager.actions.register ({
                    'help'   : 'Variable Inspector',
                    'icon'   : 'fa-crosshairs',
                    'handler': toggleVarInspector,
                }, 'toggle-variable-inspector', 'varInspector')
            ])).find('.btn').attr('id', 'varInspector_button');
        }
    };

    var load_css = function() {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = requirejs.toUrl("./main.css");
        document.getElementsByTagName("head")[0].appendChild(link);
    };


function html_table(jsonVars) {
    function _trunc(x, L) {
        x = String(x)
        if (x.length < L) return x
        else return x.substring(0, L - 3) + '...'
    }
    var kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase()
    var kernel_config = cfg.kernels_config[kernelLanguage];
    var varList = JSON.parse(String(jsonVars))

    var shape_str = '';
    var has_shape = false;
    if (varList.some(listVar => "varShape" in listVar && listVar.varShape !== '')) { //if any of them have a shape
        shape_str = '<th >Shape</th>';
        has_shape = true;
    }
    var beg_table = '<div class=\"inspector\"><table class=\"table fixed table-condensed table-nonfluid \"><col /> \
 <col  /><col /><thead><tr><th >X</th><th >Name</th><th >Type</th><th >Size</th>' + shape_str + '<th >Value</th></tr></thead><tr><td> \
 </td></tr>';
    varList.forEach(listVar => {
        var shape_col_str = '</td><td>';
        if (has_shape) {
            shape_col_str = '</td><td>' + listVar.varShape + '</td><td>';
        }
        beg_table +=
            '<tr><td><a href=\"#\" onClick=\"Jupyter.notebook.kernel.execute(\'' +
            kernel_config.delete_cmd_prefix + listVar.varName + kernel_config.delete_cmd_postfix + '\'' + '); ' +
            'Jupyter.notebook.events.trigger(\'varRefresh\'); \">x</a></td>' +
            '<td>' + _trunc(listVar.varName, cfg.cols.lenName) + '</td><td>' + _trunc(listVar.varType, cfg.cols.lenType) +
            '</td><td>' + listVar.varSize + shape_col_str + _trunc(listVar.varContent, cfg.cols.lenVar) +
            '</td></tr>';
    });
    var full_table = beg_table + '</table></div>';
    return full_table;
    }



    function code_exec_callback(msg) {
        var jsonVars = msg.content['text'];
        var notWellDefined = false;
        if (msg.content.evalue) 
            notWellDefined = msg.content.evalue == "name 'var_dic_list' is not defined" || 
        msg.content.evalue.substr(0,28) == "Error in cat(var_dic_list())"
        //means that var_dic_list was cleared ==> need to retart the extension
        if (notWellDefined) varInspector_init() 
        else $('#varInspector').html(html_table(jsonVars))
        
        requirejs(['nbextensions/varInspector/jquery.tablesorter.min'],
            function() {
        setTimeout(function() { if ($('#varInspector').length>0)
            $('#varInspector table').tablesorter()}, 50)
        });
    }

    function tableSort() {
        requirejs(['nbextensions/varInspector/jquery.tablesorter.min'])
        $('#varInspector table').tablesorter()
    }

    var varRefresh = function() {
        var kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase()
        var kernel_config = cfg.kernels_config[kernelLanguage];
        requirejs(['nbextensions/varInspector/jquery.tablesorter.min'],
            function() {
                Jupyter.notebook.kernel.execute(
                    kernel_config.varRefreshCmd, { iopub: { output: code_exec_callback } }, { silent: false }
                );
            });
    }


    var varInspector_init = function() {
        // Define code_init
        // read and execute code_init 
        function read_code_init(lib) {
            var libName = Jupyter.notebook.base_url + "nbextensions/varInspector/" + lib;
            $.get(libName).done(function(data) {
                st.code_init = data;
                st.code_init = st.code_init.replace('lenName', cfg.cols.lenName).replace('lenType', cfg.cols.lenType)
                        .replace('lenVar', cfg.cols.lenVar)
                        //.replace('types_to_exclude', JSON.stringify(cfg.types_to_exclude).replace(/\"/g, "'"))
                requirejs(
                        [
                            'nbextensions/varInspector/jquery.tablesorter.min'
                            //'nbextensions/varInspector/colResizable-1.6.min'
                        ],
                        function() {
                            Jupyter.notebook.kernel.execute(st.code_init, { iopub: { output: code_exec_callback } }, { silent: false });
                        })
                    variable_inspector(cfg, st);  // create window if not already present      
                console.log(log_prefix + 'loaded library');
            }).fail(function() {
                console.log(log_prefix + 'failed to load ' + lib + ' library')
            });
        }

            // read configuration  

            cfg = read_config(cfg, function() {                
            // Called when config is available
                if (typeof Jupyter.notebook.kernel !== "undefined" && Jupyter.notebook.kernel !== null) {
                    var kernelLanguage = Jupyter.notebook.metadata.kernelspec.language.toLowerCase()
                    var kernel_config = cfg.kernels_config[kernelLanguage];
                    if (kernel_config === undefined) { // Kernel is not supported
                        console.warn(log_prefix + " Sorry, can't use kernel language " + kernelLanguage + ".\n" +
                            "Configurations are currently only defined for the following languages:\n" +
                            Object.keys(cfg.kernels_config).join(', ') + "\n" +
                            "See readme for more details.");
                        if ($("#varInspector_button").length > 0) { // extension was present
                            $("#varInspector_button").remove(); 
                            $('#varInspector-wrapper').remove();
                            // turn off events
                            events.off('execute.CodeCell', varRefresh); 
                            events.off('varRefresh', varRefresh);
                        }
                        return
                    }
                    varInspector_button(); // In case button was removed 
                    // read and execute code_init (if kernel is supported)
                    read_code_init(kernel_config.library);
                    // console.log("code_init-->", st.code_init)
                    } else {
                    console.warn(log_prefix + "Kernel not available?");
                    }
            }); // called after config is stable  

            // event: on cell execution, update the list of variables 
            events.on('execute.CodeCell', varRefresh);
            events.on('varRefresh', varRefresh);
            }


    var create_varInspector_div = function(cfg, st) {
        function save_position(){
            Jupyter.notebook.metadata.varInspector.position = {
                'left': $('#varInspector-wrapper').css('left'),
                'top': $('#varInspector-wrapper').css('top'),
                'width': $('#varInspector-wrapper').css('width'),
                'height': $('#varInspector-wrapper').css('height'),
                'right': $('#varInspector-wrapper').css('right')
            };
        }
        var varInspector_wrapper = $('<div id="varInspector-wrapper"/>')
            .append(
                $('<div id="varInspector-header"/>')
                .addClass("header")
                .text("Variable Inspector ")
                .append(
                    $("<a/>")
                    .attr("href", "#")
                    .text("[x]")
                    .addClass("kill-btn")
                    .attr('title', 'Close window')
                    .click(function() {
                        toggleVarInspector();
                        return false;
                    })
                )
                .append(
                    $("<a/>")
                    .attr("href", "#")
                    .addClass("hide-btn")
                    .attr('title', 'Hide Variable Inspector')
                    .text("[-]")
                    .click(function() {
                        $('#varInspector-wrapper').css('position', 'fixed');
                        $('#varInspector').slideToggle({
                            start: function(event, ui) {
                                // $(this).width($(this).width());
                            },
                            'complete': function() {
                                    Jupyter.notebook.metadata.varInspector['varInspector_section_display'] = $('#varInspector').css('display');
                                    save_position();
                                    Jupyter.notebook.set_dirty();
                            }
                        });
                        $('#varInspector-wrapper').toggleClass('closed');
                        if ($('#varInspector-wrapper').hasClass('closed')) {
                            cfg.oldHeight = $('#varInspector-wrapper').height(); //.css('height');
                            $('#varInspector-wrapper').css({ height: 40 });
                            $('#varInspector-wrapper .hide-btn')
                                .text('[+]')
                                .attr('title', 'Show Variable Inspector');
                        } else {
                            $('#varInspector-wrapper').height(cfg.oldHeight); //css({ height: cfg.oldHeight });
                            $('#varInspector').height(cfg.oldHeight - $('#varInspector-header').height() - 30 )
                            $('#varInspector-wrapper .hide-btn')
                                .text('[-]')
                                .attr('title', 'Hide Variable Inspector');
                        }
                        return false;
                    })
                ).append(
                    $("<a/>")
                    .attr("href", "#")
                    .text("  \u21BB")
                    .addClass("reload-btn")
                    .attr('title', 'Reload Variable Inspector')
                    .click(function() {
                        //variable_inspector(cfg,st); 
                        varRefresh();
                        return false;
                    })
                ).append(
                    $("<span/>")
                    .html("&nbsp;&nbsp")
                ).append(
                    $("<span/>")
                    .html("&nbsp;&nbsp;")
                )
            ).append(
                $("<div/>").attr("id", "varInspector").addClass('varInspector')
            )

        $("body").append(varInspector_wrapper);
        // Ensure position is fixed
        $('#varInspector-wrapper').css('position', 'fixed');

        // enable dragging and save position on stop moving
        $('#varInspector-wrapper').draggable({
            drag: function(event, ui) {}, //end of drag function
            start: function(event, ui) {
                $(this).width($(this).width());
            },
            stop: function(event, ui) { // on save, store window position
                    save_position();
                    Jupyter.notebook.set_dirty();
                // Ensure position is fixed (again)
                $('#varInspector-wrapper').css('position', 'fixed');
            },
        });

        $('#varInspector-wrapper').resizable({
            resize: function(event, ui) {
                $('#varInspector').height($('#varInspector-wrapper').height() - $('#varInspector-header').height());
            },
            start: function(event, ui) {
                //$(this).width($(this).width());
                $(this).css('position', 'fixed');
            },
            stop: function(event, ui) { // on save, store window position
                    save_position();
                    $('#varInspector').height($('#varInspector-wrapper').height() - $('#varInspector-header').height())
                    Jupyter.notebook.set_dirty();
                // Ensure position is fixed (again)
                //$(this).css('position', 'fixed');
            }
        })

        // restore window position at startup
            if (Jupyter.notebook.metadata.varInspector.position !== undefined) {
                $('#varInspector-wrapper').css(Jupyter.notebook.metadata.varInspector.position);
            }
        // Ensure position is fixed
        $('#varInspector-wrapper').css('position', 'fixed');

        // Restore window display 
            if (Jupyter.notebook.metadata.varInspector !== undefined) {
                if (Jupyter.notebook.metadata.varInspector['varInspector_section_display'] !== undefined) {
                    $('#varInspector').css('display', Jupyter.notebook.metadata.varInspector['varInspector_section_display'])
                    //$('#varInspector').css('height', $('#varInspector-wrapper').height() - $('#varInspector-header').height())
                    if (Jupyter.notebook.metadata.varInspector['varInspector_section_display'] == 'none') {
                        $('#varInspector-wrapper').addClass('closed');
                        $('#varInspector-wrapper').css({ height: 40 });
                        $('#varInspector-wrapper .hide-btn')
                            .text('[+]')
                            .attr('title', 'Show Variable Inspector');
                    }
                }
                if (Jupyter.notebook.metadata.varInspector['window_display'] !== undefined) {
                    console.log(log_prefix + "Restoring Variable Inspector window");
                    $('#varInspector-wrapper').css('display', Jupyter.notebook.metadata.varInspector['window_display'] ? 'block' : 'none');
                    if ($('#varInspector-wrapper').hasClass('closed')){
                        $('#varInspector').height(cfg.oldHeight - $('#varInspector-header').height())
                    }else{
                        $('#varInspector').height($('#varInspector-wrapper').height() - $('#varInspector-header').height()-30)
                    }
                    
                }
            }
        // if varInspector-wrapper is undefined (first run(?), then hide it)
        if ($('#varInspector-wrapper').css('display') == undefined) $('#varInspector-wrapper').css('display', "none") //block

        varInspector_wrapper.addClass('varInspector-float-wrapper');
    }

    var variable_inspector = function(cfg, st) {

        var varInspector_wrapper = $("#varInspector-wrapper");
        if (varInspector_wrapper.length === 0) {
            create_varInspector_div(cfg, st);
        }

        $(window).resize(function() {
            $('#varInspector').css({ maxHeight: $(window).height() - 30 });
            $('#varInspector-wrapper').css({ maxHeight: $(window).height() - 10 });
        });

        $(window).trigger('resize');
        varRefresh();
    };

    var toggle_varInspector = function(cfg, st) {
        // toggle draw (first because of first-click behavior)
        $("#varInspector-wrapper").toggle({
            'progress': function() {},
            'complete': function() {
                    Jupyter.notebook.metadata.varInspector['window_display'] = $('#varInspector-wrapper').css('display') == 'block';
                    Jupyter.notebook.set_dirty();
                // recompute:
                variable_inspector(cfg, st);
            }
        });
    };


    var load_jupyter_extension = function() {
        load_css(); //console.log("Loading css")
        varInspector_button(); //console.log("Adding varInspector_button")

        // If a kernel is available, 
        if (typeof Jupyter.notebook.kernel !== "undefined" && Jupyter.notebook.kernel !== null) {
            console.log(log_prefix + "Kernel is available -- varInspector initializing ")
            varInspector_init();
        }
        // if a kernel wasn't available, we still wait for one. Anyway, we will run this for new kernel 
        // (test if is is a Python kernel and initialize)
        // on kernel_ready.Kernel, a new kernel has been started and we shall initialize the extension
        events.on("kernel_ready.Kernel", function(evt, data) {
            console.log(log_prefix + "Kernel is available -- reading configuration");
            varInspector_init();
        });
    };

    return {
        load_ipython_extension: load_jupyter_extension,
        varRefresh: varRefresh
    };

});
