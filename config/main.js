// Copyright (c) IPython-Contrib Team.
// Distributed under the terms of the Modified BSD License.

// Show notebook extension configuration

require([
    'base/js/namespace',
    'base/js/utils',
    'base/js/page',
    'base/js/events',
    'jquery',
    'require',
    'contents',
    'services/config'
], function(
    IPython,
    utils,
    page,
    events,
    $, require,
    contents,
    configmod
    ){
    page = new page.Page();

    var base_url = utils.get_body_data('baseUrl');
    var extension_list = $('body').data('extension-list');

    var html = "";
    
    for(var i=0; i < extension_list.length; i++) {
        var extension = extension_list[i];
        var url = base_url + extension['url'];
        var icon = url + '/' +  extension['Icon'];
        var id = extension['Name'].replace(/\s+/g, '');

        html += '<div class="row">\n'
               +'  <div class="row nbextension-row" >\n';

        html += '    <div class="col-xs-4 col-sm-6">'
               +'      <div class="col-sm-9">'
               +'        <h3>' + extension['Name'] + '</h3></div>';

        html += '<div class="col-sm-9">' + extension['Description'] + 
                ' <a href="' + extension['Link'] + '">more...</a></div><br>';
        html += '<div class="col-sm-9">'
               +'<button type="button" class="btn btn-primary" id="' 
                    + id + '-on" >Activate</button>'
               +'<button type="button" class="btn btn-default" disabled="disabled" id="' 
                    + id + '-off" >Deactivate</button>'  
               +'</div></div>'
               +'    <div class="col-xs-8 col-sm-6">\n';
        html += '    <img src="' + icon + '" height="120px" /></div>'
               +'</div></div>'

    }
	$("#nbextensions-container").html(html)

    /**
     *
     */ 
    var changeConfig = function(id,state) {
        for(var i=0; i < extension_list.length; i++) {
            var extension = extension_list[i];
            var url = base_url + extension['url'] + '/' + extension['Main'];
            url = url.split('.js')[0];
            url = url.split('nbextensions/')[1]  ;
            var extid = extension['Name'].replace(/\s+/g, '');
            if (extid === id) {
                var ext = {};
                
                if (state === true) {
                    console.log("Turn extension " + extension['Name'] + ' on');
                    ext[url] = true;
                    config.update({"load_extensions": ext })
                } else {
                    console.log("Turn extension " + extension['Name'] + ' off');
                    ext[url] = null;
                    config.update({"load_extensions": ext })
                }
            }
        }
    }
    
    /**
     * Handle button click event
     */
    var clickEvent = function(e)  {
        
        var id = this.id.replace(/-on|-off/,'');
        var state = this.id.search(/-on/) >= 0;
        if (state === true) {
            set_buttons(id,false);
            changeConfig(id,true)
        } else {
            set_buttons(id,true);
            changeConfig(id,false)
        }
    };
    
    for(var i=0; i < extension_list.length; i++) {
        var extension = extension_list[i];
        var id = extension['Name'].replace(/\s+/g, '');
        console.log("ID:",id);
        $('#'+id+'-on').on('click', clickEvent );
        $('#'+id+'-off').on('click', clickEvent )
    }

    var config = new configmod.ConfigSection('notebook', {base_url: base_url});
    config.load();    

    var set_buttons = function(id, state) {
        var on = $('#'+id+'-on');
        var off = $('#'+id+'-off');
        if (state === true) {
            on = $('#'+id+'-off');
            off = $('#'+id+'-on')
        }
        
        on.prop('disabled', true);
        on.removeClass('btn-primary');
        on.addClass('btn-default');
        off.prop('disabled', false);
        off.addClass('btn-primary');
        off.removeClass('btn-default')
    };
    
    config.loaded.then(function() {
        if (config.data.load_extensions) {
            var nbextension_paths = Object.getOwnPropertyNames(
                                        config.data.load_extensions);
            for(var i=0; i < extension_list.length; i++) {
                var extension = extension_list[i];
                var url = base_url + extension['url'] + '/' + extension['Main'];
                url = url.split('.js')[0];
                url = url.split('nbextensions/')[1]      ;
                if ( config.data.load_extensions[url] === true) {
                    var id = extension['Name'].replace(/\s+/g, '');
                    set_buttons(id,false);
                }
            }
        }
    });

    /**
     * Add CSS file
     *
     * @param name filename
     */
    var load_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);
      };
    load_css('/nbextensions/config/main.css');
    page.show();
	
});
