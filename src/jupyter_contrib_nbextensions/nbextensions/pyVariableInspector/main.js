define(["require", "jquery", "base/js/namespace", 'services/config', 
    'base/js/events', 'base/js/utils', 'notebook/js/codecell'
], function(require, $, Jupyter, configmod, events, utils, codecell) {

    var Notebook = require('notebook/js/notebook').Notebook 
    "use strict";

    // ...........Parameters configuration......................
    // define default values for config parameters if they were not present in general settings (notebook.json)
    var cfg = {
        'window_display': false,
        'cols': {
            'lenName': 16,
            'lenType': 16,
            'lenVar': 40
        },
        'types_to_exclude': ['module', 'function', 'builtin_function_or_method', 'instance', '_Feature']
    }


    //.....................global variables....


    var st = {}
    st.config_loaded = false;
    st.extension_initialized = false;

    function read_config(cfg, callback) { // read after nb is loaded
        // create config object to load parameters
        var base_url = utils.get_body_data("baseUrl");
        var initial_cfg = $.extend(true, {}, cfg);
        var config = Jupyter.notebook.config; //new configmod.ConfigSection('notebook', { base_url: base_url });
        config.loaded.then(function() {
            // config may be specified at system level or at document level.
            // first, update defaults with config loaded from server
            cfg = $.extend(true, cfg, config.data.pyVarInspector);
            // then update cfg with some vars found in current notebook metadata
            // and save in nb metadata (then can be modified per document)

            // window_display is taken from notebook metadata
            if (Jupyter.notebook.metadata.pyVarInspector) {
                if (Jupyter.notebook.metadata.pyVarInspector.window_display)
                    cfg.window_display = Jupyter.notebook.metadata.pyVarInspector.window_display;
            }

            cfg = Jupyter.notebook.metadata.pyVarInspector = $.extend(true,
            cfg, Jupyter.notebook.metadata.pyVarInspector);       

            // but types_to_exclude and cols are taken from system (if defined)
            if (config.data.pyVarInspector) {
                if (config.data.pyVarInspector.types_to_exclude) {
                    cfg.types_to_exclude = config.data.pyVarInspector.types_to_exclude
                }
                if (config.data.pyVarInspector.cols) {
                    cfg.cols = $.extend(true, cfg.cols, config.data.pyVarInspector.cols);  
                }
            }

            // call callbacks
            callback && callback();
            st.config_loaded = true;
        })
        config.load();
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
            Jupyter.toolbar.add_buttons_group([{
                'label': 'Variable Inspector',
                'icon': 'fa-crosshairs',
                'callback': toggleVarInspector,
                'id': 'varInspector_button'
            }]);
        }
    };

    var load_css = function() {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl("./main.css");
        document.getElementsByTagName("head")[0].appendChild(link);
    };


    function code_exec_callback(msg) {
        $('#varInspector').html(msg.content['text'])
        require(['nbextensions/pyVarInspector/jquery.tablesorter.min'],
            function() {
        setTimeout(function() { if ($('#varInspector').length>0)
            $('#varInspector table').tablesorter()}, 50)
        });
    }

    function tableSort() {
        require(['nbextensions/pyVarInspector/jquery.tablesorter.min'])
        $('#varInspector table').tablesorter()
    }

    var varRefresh = function() {
        require(['nbextensions/pyVarInspector/jquery.tablesorter.min'],
            function() {
                Jupyter.notebook.kernel.execute(
                    "print(var_list())", { iopub: { output: code_exec_callback } }, { silent: false }
                );
            });
    }


    var varInspector_init = function() {
        // Define code_init
        var code_init = ["from __future__ import print_function",
                "from sys import getsizeof",
                "from IPython.core.magics.namespace import NamespaceMagics",
                "_nms = NamespaceMagics()",
                "_Jupyter = get_ipython()",
                "_nms.shell = _Jupyter.kernel.shell",
                "def _trunc(x,L): return x[:L-3]+'...' if len(x)>L else x[:L]",
                "def _getsizeof(x):",
                "   if type(x).__name__ in ['ndarray', 'Series']:  return x.nbytes",
                "   elif type(x).__name__ == 'DataFrame': return x.memory_usage().sum()",
                "   else: return getsizeof(x)",
                "def _tableRow(v):",
                "    var = eval(v)",
                "    return '<a href=\"#\" onClick=\"Jupyter.notebook.kernel.execute(\\'del {4}\\'); Jupyter.notebook.events.trigger(\\'varRefresh\\'); \">x</a></td><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}'.format(",
                "     _trunc(v,lenName), _trunc(type(var).__name__,lenType), ",
                "     _getsizeof(var), _trunc(str(var),lenVar), v)",
                "def var_list():",
                "    values = _nms.who_ls()",
                "    _html = '<div class=\"inspector\"><table class=\"table fixed table-condensed table-nonfluid \"><col /> \\",
                "    <col  /><col /><thead><tr><th >X</th><th >Name</th><th >Type</th><th >Size</th><th >Value</th></tr></thead><tr><td>' + \\",
                "            '</td></tr><tr><td>'.join([ _tableRow(v) for v in values if (v not in ['_html', '_nms', 'NamespaceMagics', '_Jupyter']) & (type(eval(v)).__name__ not in types_to_exclude)]) + \\",
                "            '</td></tr></table></div>'",
                "    return _html",
                "print(var_list())"
            ].join('\n')
            
            // read configuration  

        cfg = read_config(cfg, function() {
            // Called when config is available
            code_init = code_init.replace('lenName', cfg.cols.lenName).replace('lenType', cfg.cols.lenType)
            .replace('lenVar', cfg.cols.lenVar)
            .replace('types_to_exclude',JSON.stringify(cfg.types_to_exclude).replace(/\"/g,"'"))
            //             
            // kernel may already have been loaded before we get here, in which
            // case we've missed the kernel_ready.Kernel event, so try ctx
            if (typeof Jupyter.notebook.kernel !== "undefined" && Jupyter.notebook.kernel !== null) {
                if (Jupyter.notebook.metadata.kernelspec.language.toLowerCase() == 'python') {                    
                    require(
                        [
                            'nbextensions/pyVarInspector/jquery.tablesorter.min'
                            //'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.25.7/js/jquery.tablesorter.min.js'
                            //'nbextensions/pyVarInspector/colResizable-1.6.min'
                        ],
                        function() {
                            Jupyter.notebook.kernel.execute(code_init, { iopub: { output: code_exec_callback } }, { silent: false });
                        })
                    variable_inspector(cfg, st);
                } else {
                    alert("pyVariableInspector only works with a Python kernel")
                }
            }
        }); // called after config is stable  

        // event: if kernel_ready (kernel change/restart)
        events.on("kernel_ready.Kernel", function() {
            Jupyter.notebook.kernel.execute(code_init, { iopub: { output: code_exec_callback } }, { silent: false });
        })

        // event: on cell execution, update the list of variables 
        events.on('execute.CodeCell', varRefresh);
        events.on('varRefresh', varRefresh);
    }

    var create_varInspector_div = function(cfg, st) {
        function save_position(){
            Jupyter.notebook.metadata.pyVarInspector.position = {
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
                                    Jupyter.notebook.metadata.pyVarInspector['varInspector_section_display'] = $('#varInspector').css('display');
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
            if (Jupyter.notebook.metadata.pyVarInspector.position !== undefined) {
                $('#varInspector-wrapper').css(Jupyter.notebook.metadata.pyVarInspector.position);
            }
        // Ensure position is fixed
        $('#varInspector-wrapper').css('position', 'fixed');

        // Restore window display 
            if (Jupyter.notebook.metadata.pyVarInspector !== undefined) {
                if (Jupyter.notebook.metadata.pyVarInspector['varInspector_section_display'] !== undefined) {
                    $('#varInspector').css('display', Jupyter.notebook.metadata.pyVarInspector['varInspector_section_display'])
                    //$('#varInspector').css('height', $('#varInspector-wrapper').height() - $('#varInspector-header').height())
                    if (Jupyter.notebook.metadata.pyVarInspector['varInspector_section_display'] == 'none') {
                        $('#varInspector-wrapper').addClass('closed');
                        $('#varInspector-wrapper').css({ height: 40 });
                        $('#varInspector-wrapper .hide-btn')
                            .text('[+]')
                            .attr('title', 'Show Variable Inspector');
                    }
                }
                if (Jupyter.notebook.metadata.pyVarInspector['window_display'] !== undefined) {
                    console.log("[pyVarInspector] Restoring Variable Inspector window");
                    $('#varInspector-wrapper').css('display', Jupyter.notebook.metadata.pyVarInspector['window_display'] ? 'block' : 'none');
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
                    Jupyter.notebook.metadata.pyVarInspector['window_display'] = $('#varInspector-wrapper').css('display') == 'block';
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
            console.log("[pyVarInspector] Kernel is available -- pyVarInspector initializing ")
            varInspector_init();
        }
        // if a kernel wasn't available, we still wait for one. Anyway, we will run this for new kernel 
        // (test if is is a Python kernel and initialize)
        // on kernel_ready.Kernel, a new kernel has been started and we shall initialize the extension
        events.on("kernel_ready.Kernel", function(evt, data) {
            console.log("[pyVarInspector] Kernel is available -- pyVarInspector initializing");
            varInspector_init();
        });
    };

    return {
        load_ipython_extension: load_jupyter_extension,
        varRefresh: varRefresh
    };

});
