define(function() {
    var CellToolbar = IPython.CellToolbar;

    // generate a checkbox for <tagname> bound to 
    // cell.metadata.<namespace>.<tagname>
    // and return the key to register for it a a preset.
    var tagg = function (namespace, tagname){
        var local = CellToolbar.utils.checkbox_ui_generator(tagname,
             function(cell, value){
                 if (cell.metadata[namespace] == undefined){cell.metadata[namespace] = {}}
                 cell.metadata[namespace][tagname] = value
                 },
             function(cell){ var ns = cell.metadata[namespace];
                 return (ns == undefined)? undefined: ns[tagname]
                 }
        );
        var cname = namespace+'_'+tagname
        CellToolbar.register_callback(namespace+'_'+tagname,local);
        return cname
    }

    // generate a preset with name <UIname>
    // that register a bunch of tags [<tagsname>,...]s
    // bound to cell.metadata.<namespace>.<tagname> = [Bool|unset]
    var new_tag_set = function(UIname, namespace, tagsnames){
        var taglistname = []
        for( var i in tagsnames){
            taglistname.push(tagg(namespace, tagsnames[i]))
        }
        CellToolbar.register_preset(UIname, taglistname)
    }

    // 
    //taggl('Software Carpentry Tags', 'swc' ,['instructor','learner','exercise'])
    //
    return {new_tag_set:new_tag_set}
})
