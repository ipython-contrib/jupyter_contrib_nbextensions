define(["require", "jquery", "base/js/namespace", 'services/config',
    'base/js/utils', 'notebook/js/codecell'
], function(require, $, IPython, configmod, utils, codecell) {

    var Notebook = require('notebook/js/notebook').Notebook 
    "use strict";
    //require('https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.25.7/js/jquery.tablesorter.min.js')

    // ...........Parameters configuration......................
    // define default values for config parameters if they were not present in general settings (notebook.json)
    var cfg = {
        'window_display': false,
        'lenName': 16,
        'lenType': 16,
        'lenVar': 40,
        'types_to_exclude': ['module', 'function', 'builtin_function_or_method', 'instance', '_Feature']  
    }

    //.....................global variables....

    var liveNotebook = !(typeof IPython == "undefined")

    var st = {}
    st.config_loaded = false;
    st.extension_initialized = false;

    function read_config(cfg, callback) { // read after nb is loaded
        // create config object to load parameters
        var base_url = utils.get_body_data("baseUrl");
        var initial_cfg = $.extend(true, {}, cfg);
        var config = new configmod.ConfigSection('notebook', { base_url: base_url });
        config.loaded.then(function() {
            // config may be specified at system level or at document level.
            // first, update defaults with config loaded from server
            cfg = $.extend(true, cfg, config.data.pyVarInspector);
            // then update cfg with anything found in current notebook metadata
            // and save in nb metadata (then can be modified per document)
            if (IPython.notebook.metadata.pyVarInspector) {
                if (IPython.notebook.metadata.pyVarInspector.window_display)
                    cfg.window_display = IPython.notebook.metadata.pyVarInspector.window_display;
            }
            cfg = IPython.notebook.metadata.pyVarInspector = $.extend(true, cfg,
            IPython.notebook.metadata.pyVarInspector);
            

            if (config.data.pyVarInspector.types_to_exclude){
                cfg.types_to_exclude = config.data.pyVarInspector.types_to_exclude
            }
            // call callbacks
            callback && callback();
            st.config_loaded = true;
        })
        config.load();
        return cfg;
    }

    var sortable;
    var bst = require(
        ['https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.25.7/js/jquery.tablesorter.min.js'],
        function() {
            sortable = true;
        },
        function(err) {
            sortable = false;
        }
    );

    function toggleVarInspector() {
        toggle_varInspector(cfg, st)
    }

    var varInspector_button = function() {
        if (!IPython.toolbar) {
            $([IPython.events]).on("app_initialized.NotebookApp", varInspector_button);
            return;
        }
        if ($("#varInspector_button").length === 0) {
            IPython.toolbar.add_buttons_group([{
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
        require(['https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.25.7/js/jquery.tablesorter.min.js'],
            function() {
        setTimeout(function() { if ($('#varInspector').length>0)
            $('#varInspector table').tablesorter()}, 50)
        });
    }

    function tableSort() {
        require(['https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.25.7/js/jquery.tablesorter.min.js'])
        $('#varInspector table').tablesorter()
    }

    var varRefresh = function() {
        require(['https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.25.7/js/jquery.tablesorter.min.js'],
            function() {
                IPython.notebook.kernel.execute(
                    "print(var_list())", { iopub: { output: code_exec_callback } }, { silent: false }
                );
            });
    }

    var _deleteIt = function(x) {
        IPython.notebook.kernel.execute("delete " + x, { iopub: { output: code_exec_callback } }, { silent: false });
    }

    var varInspector_init = function() {
        var code_init = ["from __future__ import print_function",
                "from sys import getsizeof",
                "from IPython.core.magics.namespace import NamespaceMagics",
                "_nms = NamespaceMagics()",
                "_ipython = get_ipython()",
                "_nms.shell = _ipython.kernel.shell",
                "def _trunc(x,L): return x[:L-3]+'...' if len(x)>L else x[:L]",
                "def _getsizeof(x):",
                "   if type(x).__name__ in ['ndarray', 'Series']:  return x.nbytes",
                "   elif type(x).__name__ == 'DataFrame': return x.memory_usage().sum()",
                "   else: return getsizeof(x)",
                "def _tableRow(v):",
                "    var = eval(v)",
                "    return '<a href=\"#\" onClick=\"IPython.notebook.kernel.execute(\\'del {4}\\'); IPython.notebook.events.trigger(\\'varRefresh\\'); \">x</a></td><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}'.format(",
                "     _trunc(v,lenName), _trunc(type(var).__name__,lenType), ",
                "     _getsizeof(var), _trunc(str(var),lenVar), v)",
                "def var_list():",
                "    values = _nms.who_ls()",
                "    _html = '<div class=\"inspector\"><table class=\"table fixed table-condensed table-nonfluid \"><col /> \\",
                "    <col  /><col /><thead><tr><th >X</th><th >Name</th><th >Type</th><th >Size</th><th >Value</th></tr></thead><tr><td>' + \\",
                "            '</td></tr><tr><td>'.join([ _tableRow(v) for v in values if (v not in ['_html', '_nms', 'NamespaceMagics', '_ipython']) & (type(eval(v)).__name__ not in types_to_exclude)]) + \\",
                "            '</td></tr></table></div>'",
                "    return _html",
                "print(var_list())"
            ].join('\n')
            code_init = code_init.replace('lenName', cfg.lenName).replace('lenType', cfg.lenType)
            .replace('lenVar', cfg.lenVar)
            .replace('types_to_exclude',JSON.stringify(cfg.types_to_exclude).replace(/\"/g,"'"))
            // read configuration     
        cfg = read_config(cfg, function() {
            // kernel may already have been loaded before we get here, in which
            // case we've missed the kernel_ready.Kernel event, so try ctx
            if (typeof IPython.notebook.kernel !== "undefined" && IPython.notebook.kernel !== null) {
                if (IPython.notebook.metadata.kernelspec.language.toLowerCase() == 'python') {                    
                    require(
                        [
                            'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.25.7/js/jquery.tablesorter.min.js'
                            //'nbextensions/pyVarInspector/colResizable-1.6.min'
                        ],
                        function() {
                            IPython.notebook.kernel.execute(code_init, { iopub: { output: code_exec_callback } }, { silent: false });
                        })
                    variable_inspector(cfg, st);
                } else {
                    alert("pyVariableInspector only works with a Python kernel")
                }
            }
        }); // called after config is stable  

        // event: if kernel_ready (kernel change/restart)
        $([IPython.events]).on("kernel_ready.Kernel", function() {
            IPython.notebook.kernel.execute(code_init, { iopub: { output: code_exec_callback } }, { silent: false });
            //setTimeout(function() { $('#varInspector table').tablesorter() }, 500)
                //varInspector_init()
        })

        // event: on cell execution, update the list of variables 
        $([IPython.events]).on('execute.CodeCell', varRefresh);
        $([IPython.events]).on('varRefresh', varRefresh);
    }

    var create_varInspector_div = function(cfg, st) {
        function save_position(){
            IPython.notebook.metadata.pyVarInspector['varInspector_position'] = {
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
                    .addClass("hide-btn")
                    .attr('title', 'Hide Variable Inspector')
                    .text("[-]")
                    .click(function() {
                        $('#varInspector-wrapper').css('position', 'fixed');
                        $('#varInspector').slideToggle({
                            start: function(event, ui) {
                                $(this).width($(this).width());
                            },
                            'complete': function() {
                                if (liveNotebook) {
                                    IPython.notebook.metadata.pyVarInspector['varInspector_section_display'] = $('#varInspector').css('display');
                                    save_position();
                                    IPython.notebook.set_dirty();
                                }
                            }
                        });
                        $('#varInspector-wrapper').toggleClass('closed');
                        if ($('#varInspector-wrapper').hasClass('closed')) {
                            cfg.oldHeight = $('#varInspector-wrapper').css('height');
                            $('#varInspector-wrapper').css({ height: 40 });
                            $('#varInspector-wrapper .hide-btn')
                                .text('[+]')
                                .attr('title', 'Show Variable Inspector');
                        } else {
                            // $('#varInspector-wrapper').css({height: IPython.notebook.metadata.pyVarInspector.varInspector_position['height']});
                            // $('#varInspector').css({height: IPython.notebook.metadata.pyVarInspector.varInspector_position['height']});
                            $('#varInspector-wrapper').css({ height: cfg.oldHeight });
                            $('#varInspector').css({ height: cfg.oldHeight });
                            $('#varInspector-wrapper .hide-btn')
                                .text('[-]')
                                .attr('title', 'Hide Variable Inspector');
                        }
                        return false;
                    })
                ).append(
                    $("<a/>")
                    .attr("href", "#")
                    .addClass("reload-btn")
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
                if (liveNotebook) {
                    save_position();
                    IPython.notebook.set_dirty();
                }
                // Ensure position is fixed (again)
                $('#varInspector-wrapper').css('position', 'fixed');
            },
        });

        $('#varInspector-wrapper').resizable({
            resize: function(event, ui) {
                $('#varInspector').css('height', $('#varInspector-wrapper').height() - $('#varInspector-header').height());
            },
            start: function(event, ui) {
                $(this).width($(this).width());
                //$(this).css('position', 'fixed');
            },
            stop: function(event, ui) { // on save, store window position
                if (liveNotebook) {
                    save_position();
                    $('#varInspector').css('height', $('#varInspector-wrapper').height() - $('#varInspector-header').height())
                    IPython.notebook.set_dirty();
                }
                // Ensure position is fixed (again)
                //$(this).css('position', 'fixed');
            }
        })

        // restore window position at startup
        if (liveNotebook) {
            if (IPython.notebook.metadata.pyVarInspector['varInspector_position'] !== undefined) {
                $('#varInspector-wrapper').css(IPython.notebook.metadata.pyVarInspector['varInspector_position']);
            }
        }
        // Ensure position is fixed
        $('#varInspector-wrapper').css('position', 'fixed');

        // Restore window display 
        if (liveNotebook) {
            if (IPython.notebook.metadata.pyVarInspector !== undefined) {
                if (IPython.notebook.metadata.pyVarInspector['varInspector_section_display'] !== undefined) {
                    $('#varInspector').css('display', IPython.notebook.metadata.pyVarInspector['varInspector_section_display'])
                    //$('#varInspector').css('height', $('#varInspector-wrapper').height() - $('#varInspector-header').height())
                    if (IPython.notebook.metadata.pyVarInspector['varInspector_section_display'] == 'none') {
                        $('#varInspector-wrapper').addClass('closed');
                        $('#varInspector-wrapper').css({ height: 40 });
                        $('#varInspector-wrapper .hide-btn')
                            .text('[+]')
                            .attr('title', 'Show Variable Inspector');
                    }
                }
                if (IPython.notebook.metadata.pyVarInspector['window_display'] !== undefined) {
                    console.log("******Restoring Variable Inspector display");
                    $('#varInspector-wrapper').css('display', IPython.notebook.metadata.pyVarInspector['window_display'] ? 'block' : 'none');
                }
            }
        }
        // if varInspector-wrapper is undefined (first run(?), then hide it)
        if ($('#varInspector-wrapper').css('display') == undefined) $('#varInspector-wrapper').css('display', "none") //block

        varInspector_wrapper.addClass('varInspector-float-wrapper');
    }

    var variable_inspector = function(cfg, st) {

        var varInspector_wrapper = $("#varInspector-wrapper");
        // var varInspector_index=0;
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
                if (liveNotebook) {
                    IPython.notebook.metadata.pyVarInspector['window_display'] = $('#varInspector-wrapper').css('display') == 'block';
                    IPython.notebook.set_dirty();
                }
                // recompute:
                variable_inspector(cfg, st);
            }
        });

    };


    var load_ipython_extension = function() {
        load_css(); //console.log("Loading css")
        varInspector_button(); //console.log("Adding varInspector_button")

        // Wait for the notebook to be fully loaded
        if (IPython.notebook !== undefined && IPython.notebook._fully_loaded) {
            // this tests if the notebook is fully loaded 
            console.log("[pyVarInspector] Notebook fully loaded -- pyVarInspector initialized ")
            varInspector_init();
            //          setTimeout(function(){ 
            //                        $('#varInspector table').addClass('table table-condensed table-nonfluid').tablesorter(), 2500})  
        } else {
            console.log("[pyVarInspector] Waiting for notebook availability")
            $([IPython.events]).on("notebook_loaded.Notebook", function() {
                console.log("[pyVarInspector] pyVarInspector initialized (via notebook_loaded)")
                varInspector_init();
                //setTimeout(function(){ 
                //          $('#varInspector table').addClass('table table-condensed table-nonfluid').tablesorter(), 2500})  
            })
        }
    };

    return {
        load_ipython_extension: load_ipython_extension,
        varRefresh: varRefresh
    };

});
