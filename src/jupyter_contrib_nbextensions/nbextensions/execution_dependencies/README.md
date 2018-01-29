execution_dependencies
======================

Writing extensive notebooks can become very complicated since many cells act as stepping stones to produce intermediate results for later cells. Thus, it becomes tedious to
keep track of the cells that have to be run in order to run a certain cell. This extension simplifies handling the execution dependencies by introducing tag annotations to
identify each cell and indicate a dependency on others. This improves on the current state which requires remembering all dependencies by heart or annotating the cells in the comments.

If a cell with dependencies is run, the extension checks recursively for all dependencies of the cell, then executes them before executing the cell after all the dependencies have finished.
Dependencies are definitely executed and not only once per kernel session.

The two annotations are added to the tags of a cell and are as follows:

 * add a hashmark (#) and an identification tag to the tags to identify a cell (e.g. #initializer-cell). The #identifiers must be unique among all cells.
 * add an arrow (=>) and an identification tag to the tags to add a dependency on a certain cell (e.g. =>initializer-cell).

Based on these dependencies, the kernel will now execute the dependencies before the cell that depends on them. If the cell's dependencies have further dependencies, these will in turn
be executed before them. In conclusion, the kernel looks through the tree of dependencies of the cell executed by the user and executes its dependencies in their appropriate order, 
then executes the cell.

A more extensive example is described below:

A cell A has the identifier #A.

| Cell A [tags: #A]  |
| ------------- | 
| Content Cell  |
| Content Cell  |


A cell B has the identifier #B and depends on A (=>A).


| Cell B [tags: #B, =>A]  |
| ------------- | 
| Content Cell  |
| Content Cell  |

If the user runs A, only A is executed, since it has no dependencies. On the other hand, if the user runs B, the kernel finds the dependency on A, and thus first runs A and then runs B.

Running a cell C that is dependent on B and on A as well, the kernel then first runs A and then runs B before running C, avoiding to run cell A twice.


If you are missing anything, open up an issue at the repository prepending [execute_dependencies] to the title.
