// Adds a button to hide all cells below the selected heading
define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events'
], function(IPython, $, require, events) {
      "use strict";
      if (IPython.version[0] != 3) {
        console.log("This extension requires IPython 3.x");
        return;
      }

      /**
       * Return the level of nbcell.
       *
       * @param {Object} cell notebook cell
       */
      var get_cell_level = function (cell) {
        // headings can have a level upto 6
        // therefore 7 is returned
        var level = 7;
        if ( cell !== null ) {
          var l = cell.metadata.level;
          if ( !(( l < 8 ) && ( l > 0 )) ) {
            cell.metadata.level = 7;
          }
          level = cell.metadata.level;
        }
        return level;
      }

      var compute_cell_level = function (cell) {
        // headings can have a level upto 6
        // therefore 7 is returned
        var level = 7;
        if( is_heading(cell) ) {
          // since this is heading cell we know it's level is at least 1
          level = 1;
          var text = cell.get_text();
          while ( (level < 6) && (text[level] === '#') ) {
            level++;
          }
        }
        cell.metadata.level = level;
        return level;
      }

      /**
       * Find the indices of the collapsed cell branch in the cell tree with leaf index.
       */
      var find_collapsed_cell_branch_indices = function (index) {
        var current_index = index;
        var pivot_index = index;
        var collaped_cell_indices = [];

        // Restrict the search to cells that are of the same level and lower
        // than the currently selected cell by index.
        var ref_cell = IPython.notebook.get_cell(index);
        var ref_level = get_cell_level( ref_cell );
        var pivot_level = ref_level - 1;
        while( current_index > 0 ) {
          current_index--;
          var cell = IPython.notebook.get_cell(current_index);
          var cell_level = get_cell_level(cell);
          if( cell_level < pivot_level ) {
            if( is_collapsed_heading(cell) || cell_level === ref_level ) {
              pivot_index = current_index;
              if( is_collapsed_heading(cell) ) {
                collaped_cell_indices.push(current_index);
              }
            }
            pivot_level = cell_level;
          }
        }
        // Reverse to make sure the indices are ordered
        return collaped_cell_indices.reverse();
      }

      /**
       * Reveal all cells in a branch.
       */
      var reveal_cells_in_branch = function (index) {
        var collapsed_indices = find_collapsed_cell_branch_indices(index);
        collapsed_indices.forEach( function ( idx ) {
          var c = IPython.notebook.get_cell(idx);
          toggle_heading(c);
          c.metadata.heading_collapsed = false;
        } );
      }

      /**
       * Find the bottom of a cell block
       */
      var find_cell_block_bottom_index = function (index){
        var cell = IPython.notebook.get_cell(index);
        var ref_level = get_cell_level(cell);
        var ncells = IPython.notebook.ncells();
        var bottom_index = index;
        var current_index = index;
        var done = false;
        while( current_index <= ncells && !done) {
          current_index++;
          var current_cell = IPython.notebook.get_cell(current_index);
          var cell_level = get_cel_level(current_cell);
          if( cell_level > ref_level ) {
            bottom_index = current_index;
          } else {
            done = true;
          }
        }
        return(bottom_index);
      }


      /**
       * Check if a cell is a heading cell.
       */
      var is_heading = function ( cell ) {
        if ( cell !== null ) {
          if ( cell.cell_type === "markdown" ) {
            var text = cell.get_text();
            if ( text.length > 0 ) {
              return text[0] === '#';
            } else {
              return false;
            }
          }
        } else {
          return false;
        }
      }


      /**
       * Check if a cell is a collapsed heading cell.
       */
      var is_collapsed_heading = function ( cell ) {
        if ( cell !== null ) {
          if ( is_heading(cell) && cell.metadata.heading_collapsed === true ) {
            return true;
          }
        } else {
          console.log('null cell submitted to is_collapsed_heading');
        }

        return false;
      }

      var bind_events = IPython.TextCell.prototype.bind_events;
      IPython.TextCell.prototype.bind_events = function () {
        bind_events.apply(this);

        var that = this;
        this.element.find("div.prompt").click(function () {
          toggle_heading(that);
          // Mark as collapsed
          if ( is_collapsed_heading(this) ) {
            that.metadata.heading_collapsed = false;
          } else {
            that.metadata.heading_collapsed = true;
          }
        });
      };

      /**
       * Insert a cell below the current one.
       * Support heading cells.
       */
      IPython.Notebook.prototype.insert_cell_below = function (type,index) {
        index = this.index_or_selected(index);
        // check if the selected cell is collapsed
        // open first if a new cell is inserted
        var cell = this.get_cell(index);
        // uncollapse if needed
        if ( is_collapsed_heading (cell) ) {
          toggle_heading(cell);
          cell.metadata.heading_collapsed = false;
        }
        return this.insert_cell_at_index(type, index+1);
      }


      /**
       * Insert a cell above the current one.
       */
      IPython.Notebook.prototype.insert_cell_above = function (type,index) {
        index = this.index_or_selected(index);
        // check if the selected cell is collapsed
        // open first if a new cell is inserted
        var cell = this.get_cell(index);
        if ( is_heading(cell) ) {
          reveal_cells_in_branch(index - 1);
        }

        return this.insert_cell_at_index(type, index);
      }

      // This was IPython.notebook.delete_cell
      IPython.Notebook.prototype.delete_single_cell = function (index) {
        var i = this.index_or_selected(index);
        var cell = this.get_selected_cell();
        this.undelete_backup.push(cell.toJSON());
        $('#undelete_cell').removeClass('disabled');
        if (this.is_valid_cell_index(i)) {
          var ce = this.get_cell_element(i);
          ce.remove();
          if (i === (this.ncells())) {
            this.select(i-1);
            this.undelete_index.push( i - 1 );
            this.undelete_below.push( true );
          } else {
            this.select(i);
            this.undelete_index.push( i );
            this.undelete_below.push( false );
          };
          events.trigger('delete.Cell', {'cell': cell, 'index': i});
          this.set_dirty(true);
        };
        return this;
      }

      /**
       * Delete all cells in a subtree headed by the cell at index index.
       */
      var delete_cell_subtree = function (index) {

        var cell = IPython.notebook.get_cell(index);
        if( is_heading(cell) ) {

          if ( is_collapsed_heading(cell) ) {
            toggle_heading(cell)
              cell.metadata.heading_collapsed = false;
          }

          var ref_level = get_cell_level(cell);
          var level = ref_level + 1;
          var del_index_list = [];
          var min_index = index;
          while( level > ref_level && index < IPython.notebook.ncells() ) {
            del_index_list.push(index);
            index++;
            // the following code also works for an invalid index
            var cell = IPython.notebook.get_cell(index);
            var level = get_cell_level(cell);
          }
          del_index_list.forEach( function(i) {IPython.notebook.delete_single_cell( min_index )});
        }
      }


      IPython.Notebook.prototype.move_cell_down = function (index) {
        var i = this.index_or_selected(index);
        if ( this.is_valid_cell_index(i) && this.is_valid_cell_index(i+1)) {
          var pivot = this.get_cell_element(i+1);
          var tomove = this.get_cell_element(i);
          if (pivot !== null && tomove !== null) {
            var next_cell = this.get_cell(i+1);
            if ( is_collapsed_heading(next_cell) ) {
              toggle_heading( next_cell );
            }
            tomove.detach();
            pivot.after(tomove);
            this.select(i+1);
          };
        };
        this.set_dirty();
        return this;
      }


      IPython.Notebook.prototype.move_cell_up = function (index) {
        var i = this.index_or_selected(index);
        if (this.is_valid_cell_index(i) && i > 0) {
          var pivot = this.get_cell_element(i-1);
          var tomove = this.get_cell_element(i);
          if (pivot !== null && tomove !== null) {
            reveal_cells_in_branch(i-2);
            tomove.detach();
            pivot.before(tomove);
            this.select(i-1);
          };
          this.set_dirty(true);
        };
        return this;
      }


      IPython.Notebook.prototype.delete_cell = function (index) {
        var i = this.index_or_selected(index);
        var cell = this.get_cell(i);
        this.flush_undelete_buffers();
        if( is_collapsed_heading(cell) ) {
          delete_cell_subtree(i);
        } else {
          reveal_cells_in_branch(i - 1);
          this.delete_single_cell(i);
        }
      }

      IPython.Notebook.prototype.flush_undelete_buffers = function () {
        this.undelete_backup = [];
        this.undelete_index = [];
        this.undelete_below = [];
      }


      IPython.Notebook.prototype._insert_element_at_index = function(element, index){
        if (element === undefined){
          return false;
        }

        var ncells = this.ncells();

        if (ncells === 0) {
          // special case append if empty
          this.element.find('div.end_space').before(element);
        } else if ( ncells === index ) {
          // special case append it the end, but not empty
          this.get_cell_element(index-1).after(element);
        } else if (this.is_valid_cell_index(index)) {
          // otherwise always somewhere to append to
          this.get_cell_element(index).before(element);
        } else {
          return false;
        }

        if( this.undelete_index !== null ){
          for( var i=0; i < this.undelete_index.length; i++) {
            if (this.undelete_index[i] != null && index <= this.undelete_index[i]) {
              this.undelete_index[i] = this.undelete_index[i] + 1;
              this.set_dirty(true);
            }
          }
        }

        return true;
      };


      // restore all, check if the cell above has to be expanded
      IPython.Notebook.prototype.undelete = function () {

        var undelete_backup = this.undelete_backup;
        var undelete_index  = this.undelete_index;
        var undelete_below  = this.undelete_below;

        this.flush_undelete_buffers();

        var u_backup = undelete_backup.pop()
          var u_index  = undelete_index.pop()
          var u_below  = undelete_below.pop()


          while (u_backup != null && u_index != null) {
            var current_index = this.get_selected_index();
            if (u_index < current_index) {
              current_index = current_index + 1;
            }
            if (u_index >= this.ncells()) {
              this.select(this.ncells() - 1);
            }
            else {
              this.select(u_index);
            }
            var cell_data = u_backup;
            var new_cell = null;
            if (u_below) {
              new_cell = this.insert_cell_below(cell_data.cell_type);
            } else {
              new_cell = this.insert_cell_above(cell_data.cell_type);
            }
            new_cell.fromJSON(cell_data);
            this.select(current_index);
            u_backup = undelete_backup.pop();
            u_index  = undelete_index.pop();
            u_below  = undelete_below.pop();
          }
        $('#undelete_cell').addClass('disabled');
      }


      /*
       * Change the level of a heading cell.
       */
      IPython.TextCell.prototype.set_level = function (level) {

        var previouslevel = this.level;
        var index = this.element.index();
        if ( previouslevel < level ) {
          //this.level = level;
          // decreasing level: reveal this section and the one above
          reveal_cells_in_branch(index-1);
        }

        if ( is_collapsed_heading(this) === true ) {
          // If the current cell is collapsed reveal the entire section.
          toggle_heading(this);
          this.metadata.heading_collapsed = false;
        }

        this.level = level;
        if (this.rendered) {
          this.rendered = false;
          this.render();
        }
      }


      // The following methods do not have to be changed because
      // they make use of the cell removal code provided by this
      // extension.
      // Notebook.prototype.to_code
      // Notebook.prototype.to_markdown
      // Notebook.prototype.to_raw
      // So, if a heading cell is converted to one of the cell types above
      // everything still works as expected.

      /**
       * Create the DOM element of the HeadingCell
       * @method create_element
       * @private
       */

      var create_element = IPython.TextCell.prototype.create_element;
      IPython.TextCell.prototype.create_element = function () {
        create_element.apply(this, arguments);
        this.metadata.level = 7;
        this.metadata.heading_collapsed = false;
      }

      IPython.TextCell.prototype.execute = function () {
        var cell = this;

        // order matters because compute will update metadata.level
        var old_level = get_cell_level(cell);
        console.log
          var new_level = compute_cell_level(cell);

        // Check if the current cell level has changed
        var level_has_changed = ( new_level !== old_level );
        // if it has changed update the cell properties
        if ( level_has_changed === true ) {
          console.log('cell level has changed');
          if ( new_level < old_level ) {
            // if lower level, uncollapse below and recollapse if collapsed
            if ( is_collapsed_heading (cell) ) {
              toggle_heading(cell);
              this.metadata.heading_collapsed = false;
              // update cell level
              this.metadata.level = new_level;
              // recollapse
              toggle_heading(cell);
              this.metadata.heading_collapsed = true;
            } else {
              // Was not collapsed, only update properties
              this.metadata.heading_collapsed = false;
              this.element.addClass('uncollapsed_heading');
              this.metadata.level = new_level;
            }
          } else {
            // if higher level uncollapse above and below if needed
            // reveal cells above
            var index = cell.element.index();
            if ( index > 1 ) {
              if ( is_heading(cell) ) {
                reveal_cells_in_branch(index - 1);
              }
            }
            // reveal cells below
            if ( is_collapsed_heading (cell) ) {
              toggle_heading(cell);
              this.metadata.heading_collapsed = false;
            }
            // update cell properties
            this.metadata.heading_collapsed = false;
            if ( new_level < 7 ) {
              this.element.addClass('uncollapsed_heading');
              this.metadata.level = new_level;
            }

          } 
        }
        if ( new_level < 7)
          this.element.removeClass('uncollapsed_heading');
        this.render();
      }

      /**
       * Find the closest heading cell above the currently
       * selected cell which is not yet collapsed. If the
       * currently selected cell is a heading cell, no
       * new cell is sought for.
       */
      var find_toggleable_cell = function (index) {

        // Get selected cell
        var cell = IPython.notebook.get_selected_cell();

        // If the current cell is a heading cell return
        if ( is_heading(cell) ) {
          return cell;
        } else {
          // Find a heading cell that is not yet collapsed
          var index = IPython.notebook.get_selected_index();
          var is_collapsable = ( is_heading(cell) && (cell.metadata.heading_collapsed !== true) );

          while( index > 0 && !is_collapsable ) {
            index--;
            cell = IPython.notebook.get_cell( index );
            is_collapsable = ( is_heading(cell) && (cell.metadata.heading_collapsed !== true) );
          }
          if( index === 0 && !is_collapsable ) {
            // No candidate was found, return the current cell
            return IPython.notebook.get_selected_cell();
          } else {
            // select his cell and return
            IPython.notebook.select(index);
            return cell;
          }
        }

      }


      /**
       * Hide/reveal all cells in the section headed by cell.
       *
       * @param {Object} cell notebook cell
       */
      var toggle_heading = function (cell) {

        var index = cell.element.index() + 1;
        var section_level = get_cell_level( cell );
        // add/remove collapsed/uncollapsed _heading classes
        if ( is_collapsed_heading(cell) ) {
          cell.element.removeClass('collapsed_heading');
          cell.element.addClass('uncollapsed_heading');
        } else if (is_heading(cell)) {
          cell.element.removeClass('uncollapsed_heading');
          cell.element.addClass('collapsed_heading');
        }

        // Check if we have to start iterating over the
        // notebook cells
        var current_cell = IPython.notebook.get_cell( index );
        if ( current_cell === null )
          return;

        var cell_level = get_cell_level( current_cell );

        var enable_toggle = true;
        var switch_heading_level = 6;

        while( cell_level > section_level ) {

          // Hide/reveal regular cells until a heading is found that is collapsed/revealed
          // then stop collapsing/revealing until a new heading is found of that level
          if( cell_level <= switch_heading_level ) {
            if( current_cell.metadata.heading_collapsed === true ) {
              enable_toggle = false;
              // do toggle the heading
              current_cell.element.slideToggle();
              // mark the next level from which we can update enable_toggle
              switch_heading_level = get_cell_level( current_cell );
            } else {
              enable_toggle = true;
            }
          }

          // Hide the current cell
          if ( enable_toggle ) {
            current_cell.element.slideToggle();
          }

          // Proceed to the next cell
          index++;
          current_cell = IPython.notebook.get_cell( index );
          if( current_cell === null )
            break;
          cell_level = get_cell_level( current_cell );
        }

      };


      /**
       * Initialize the extension.
       * Hides all cells that were marked as collapsed.
       */
      var init_toggle_heading = function (){
        // Load css
        $('head').append('<link rel="stylesheet" href=' +
            //require.toUrl("./nbextensions/testing/hierarchical_collapse/main.css") + 
            require.toUrl("./main.css") +
            ' type="text/css" id="hierarchical_collapse_css" />');

        // Add a button to the toolbar
        IPython.toolbar.add_buttons_group([{
          label:'toggle heading',
          icon:'fa-angle-double-up',
          callback: function () {
            var cell = find_toggleable_cell();
            toggle_heading( cell );

            // Mark as collapsed
            if ( cell.metadata.heading_collapsed ) {
              cell.metadata.heading_collapsed = false;
              cell.element.removeClass('collapsed_heading');
              cell.element.addClass('uncollapsed_heading');
            } else {
              cell.metadata.heading_collapsed = true;
              cell.element.removeClass('uncollapsed_heading');
              cell.element.addClass('collapsed_heading');
            }
          }
        }]);

        // toggle all cells that are marked as collapsed
        var cells = IPython.notebook.get_cells();
        cells.forEach( function (cell){
          // modify double click prompt action for existing cells
          if( is_heading(cell) ){
            var level = compute_cell_level(cell);
            cell.element.find("div.prompt").click(function () {
              toggle_heading(cell);
              // Mark as collapsed
              if ( cell.metadata.heading_collapsed ) {
                cell.metadata.heading_collapsed = false;
                cell.element.addClass('uncollapsed_heading');
              } else {
                cell.metadata.heading_collapsed = true;
                cell.element.addClass('collapsed_heading');
              }
            });
            // initialize cells
            if ( cell.metadata.heading_collapsed ) {
              // initially set to uncollapsed
              cell.metadata.heading_collapsed = false;
              cell.element.addClass('uncollapsed_heading');
              // toggle
              toggle_heading(cell);
              cell.metadata.heading_collapsed = true;
            } else {
              cell.metadata.heading_collapsed = false;
              cell.element.addClass('uncollapsed_heading');
            }
          }
        }
        );

        // Write a message to the console to confirm the extension loaded
        console.log("hierarchical_collapse notebook extension loaded correctly");

        return true;
      }


      // Initialize the extension
      init_toggle_heading();

    });
