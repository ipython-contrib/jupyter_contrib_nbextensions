**Hello and welcome to the contribution page of jupyter notebook nbextensions!**

We are super happy that you intend to contribute to the nbextensions. Here is the plan how this works very nicely, for you and of course for the repository maintainer too.

### Create an issue

Do not hesitate to open up an issue to propose your new extension and how you would think of it to work. Like that, it is easier to point you to extensions that do similar things, whether it is worth it to implement this, what to look for etc.

Here is an example issue of how @benelot did it and it worked pretty smoothly: [#1193](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/1193)

To create a new jupyter notebook extension, just fork the repository and clone it to your local machine. Then look into the [jupyter_contrib_nbextensions/nbextensions](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions) folder and add a folder with the name of your new extension. Check out the [Jupyter Notebook extension structure Link](http://jupyter-contrib-nbextensions.readthedocs.io/en/latest/internals.html)k to know what else has to be in that folder and what are the general conventions for it.

### Create a pull request
Then, as you are ready with your contribution, pull-request to the main repo and explain quickly what you have done.

Here is an example pull request of how @benelot did it and it worked super well: [#1213](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1213)

Do not forget to add your new extension to the [CHANGELOG.md](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/blob/master/CHANGELOG.md) so that it will be announced to be in the release.