
define(["require"], function(require) {
    "use strict";

    console.log('patching codecell');
    console.log('old is', IPython.CodeCell.prototype.execute);
    IPython.CodeCell.prototype.old_execute = IPython.CodeCell.prototype.execute;

    IPython.CodeCell.prototype.execute = function () {
       console.log(this.get_text().match('_{4,}'));
       if ( ! this.get_text().match('_{4,}') ){
           console.log('oe');
           this.old_execute(arguments); // not sure of the unpacking of arguments here, might be [arguments]
       } else {
           this.output_area.element.text('not quite there yet you still have to many ____');
       }
    };

});
