/**
 * execution_dependencies.js
 * Introduce tag annotations to identify each cell and indicate a dependency on others.
 * Upon running a cell, its dependencies are run first to prepare all dependencies. 
 * Then the cell triggered by the user is run as soon as all its dependencies are met.
 *
 *
 * @version 0.1.0
 * @author  Benjamin Ellenberger, https://github.com/benelot
 * @updated 2018-01-31
 *
 *
 */
define([
    'jquery',
    'base/js/dialog',
    'base/js/namespace',
    'notebook/js/codecell'
], function (
    $,
    dialog,
    Jupyter,
    codecell
) {
    "use strict";

    var CodeCell = codecell.CodeCell;

    return {
        load_ipython_extension: function () {
            console.log('[execution_dependencies] patching CodeCell.execute');
            var orig_execute = codecell.CodeCell.prototype.execute;                                            // keep original cell execute function
            CodeCell.prototype.execute = function (stop_on_error) {
                var root_tags = this.metadata.tags || [];                                                      // get tags of the cell executed by the user (root cell)
                if(root_tags.some(tag => /=>.*/.test(tag))) {                                                  // if the root cell contains any dependencies, resolve dependency tree
                    var root_cell = this;
                    var root_cell_id = root_cell.cell_id;
                    var cells_with_id = Jupyter.notebook.get_cells().filter(function (cell, idx, cells) {      // ...get all cells which have at least one id (these are the only ones we could have in deps)
                        var tags = cell.metadata.tags || [];                        
                        return (cell === root_cell || tags.some(tag => /#.*/.test(tag)));
                    });

                    console.log('[execution_dependencies] collecting ids and dependencies...');
                    var cell_map = {}  
                    var dep_graph = {}
                    cells_with_id.forEach(function (cell) {                                                    // ...get all identified cells (the ones that have at least one #tag)
                        var tags = cell.metadata.tags || [];
                        var cell_ids = tags.filter(tag => /#.*/.test(tag)).map(tag => tag.substring(1));       // ...get all identifiers of the current cell and drop the #
                        if(cell === root_cell){                        
                            if(cell_ids.length < 1) {
                                cell_ids.push(root_cell.cell_id);                                              // ...use internal root cell id for internal usage
                            }
                            else {
                                root_cell_id = cell_ids[0];                                                    // get any of the root cell ids
                            }
                        }

                        var dep_ids = tags.filter(tag => /=>.*/.test(tag)).map(tag => tag.substring(2));       // ...get all dependencies and drop the =>
                        
                        cell_ids.forEach(function (id) {
                          //console.log('ID:', id, 'deps: ', dep_ids.toString())
                            cell_map[id] = cell;
                            dep_graph[id] = dep_ids;

                        });
                    });

                    if(dep_graph[root_cell_id].length > 0) {
                        console.log('[execution_dependencies] collecting depdendency graph in-degrees...');
                        var processing_queue = [root_cell_id];
                        var processed_nodes = 0;
                        var in_degree = {};                                                                    // ...collect in-degrees of nodes
                        while(processing_queue.length > 0 && processed_nodes < Object.keys(dep_graph).length) {// ...stay processing deps while the queue contains nodes and the processed nodes are below total node quantity
                            var id = processing_queue.shift();                                                 // .....pop front of queue and front-push it to the processing order
                          //console.log("ID: ", id);
                            for(var i=0, dep_qty=dep_graph[id].length; i < dep_qty; i++) {
                                var dep = dep_graph[id][i];
                          //    console.log('      dep: ', dep);
                                in_degree[id] = in_degree[id] || 0;
                                in_degree[dep] = in_degree[dep] === undefined ? 1 : ++in_degree[dep];
                                processing_queue.unshift(dep);
                            }
                            processed_nodes++;
                        }

                        console.log('[execution_dependencies] starting topological sort...');
                        processing_queue = [root_cell_id];                                                     // ...add root node with in-degree 0 to queue (this excludes all disconnected subgraphs)
                        processed_nodes = 0;                                                                   // ...number of processed nodes (to detect circular dependencies)
                        var processing_order = [];
                        while(processing_queue.length > 0 && processed_nodes < Object.keys(dep_graph).length) {// ...stay processing deps while the queue contains nodes and the processed nodes are below total node quantity
                            var id = processing_queue.shift();                                                 // .....pop front of queue and front-push it to the processing order
                            processing_order.unshift(id);
                          //console.log("ID: ", id);
                            for(var i=0, dep_qty=dep_graph[id].length; i < dep_qty; i++) {                     // ......iterate over dependent nodes of current id and decrease their in-degree by 1
                                var dep = dep_graph[id][i];
                          //    console.log('      dep: ', dep);
                                in_degree[dep]--;
                                if(in_degree[dep] == 0) {                                                      // ......queue dependency if in-degree is 0
                                    processing_queue.unshift(dep);
                                }
                            }
                            processed_nodes++;
                        }
                        
                        console.log('[execution_dependencies] checking for circular dependencies...');
                        if(processed_nodes > Object.keys(dep_graph).length) {                                  // ...if more nodes where processed than the number of graph nodes, there is a circular dependency
                            dialog.modal({ 
                                 title : 'Circular dependencies in the execute dependencies of this cell', 
                                 body : 'There is a circular dependency in this cell\'s execute dependencies. The cell will be run without dependencies. If this does not work, fix the dependencies and rerun the cell.', 
                                 buttons: {'OK': {'class' : 'btn-primary'}}, 
                                 notebook: Jupyter.notebook, 
                                 keyboard_manager: Jupyter.keyboard_manager, 
                             }); 
                        }
                        else if(!Jupyter.notebook.trusted) {                                                   // ...if the notebook is not trusted, we do not execute dependencies, but only print them out to the user
                            dialog.modal({ 
                                 title : 'Execute dependencies in untrusted notebook', 
                                 body : 'This notebook is not trusted, so execute dependencies will not be automatically run. You can still run them manually, though. Run in order (the last one is the cell you wanted to execute): ' + processing_order, 
                                 buttons: {'OK': {'class' : 'btn-primary'}}, 
                                 notebook: Jupyter.notebook, 
                                 keyboard_manager: Jupyter.keyboard_manager, 
                            });
                        }
                        else{
                            processing_order.pop()
                            console.log('[execution_dependencies] executing dependency cells in order ', processing_order ,'...');
                            var dependency_cells = processing_order.map(id =>cell_map[id]);                    // ...get dependent cells by their id
                          //console.log("Execute cells..", dependency_cells)
                            dependency_cells.forEach(cell => orig_execute.call(cell, stop_on_error));          // ...execute all dependent cells in sequence using the original execute method
                        }
                    }
                }
                console.log('[execution_dependencies] executing requested cell...');
                orig_execute.call(this, stop_on_error);                                                    // execute original cell execute function
            };
            console.log('[execution_dependencies] loaded');
        }
    };
});
