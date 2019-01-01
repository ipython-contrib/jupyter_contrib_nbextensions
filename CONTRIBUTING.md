# Contributing to jupyter notebook nbextensions

We are super happy that you intend to contribute to the nbextensions! You can discuss improvements in issues and implement them in pull requests.

Because this is a volunteer effort, we cannot provide support for all of the extensions.
So if you contribute a new extension, please stick around and help others using it.

## Create an issue

Do not hesitate to open up an issue, you can discuss bugs, improvements or new extensions in them. Creating an issue is a good starting point for code contributions. The community can support you with experience of similar extensions, pros and cons, what to look for etc.

Here is an example issue of how @benelot did it that worked pretty smoothly: [#1193](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/1193)

## Setup development

For small things like fixing typos in documentation, you can [make edits through GitHub](https://help.github.com/articles/editing-files-in-another-user-s-repository/), which will handle forking and making a pull request (PR) for you. For anything bigger or more complex, you'll probably want to set up a development environment, a quick procedure for which is as folows:

1. __Fork and clone__
   First fork this repo, then clone your fork. In this way you become prepared to make a pull request.

   ```shell
   # clone your fork
   git clone https://github.com/<your-github-username>/jupyter_contrib_nbextensions.git
   cd jupyter_contrib_nbextensions
   ```

2. __Setup__

   If you're using python in combination with some form of virtual environment (e.g. conda, virtualenv), make sure you have the correct environment (the one from which you run `jupyter notebook`) active before running these commands!

   ```shell
   # run from the main directory, where setup.py is
   pip install --editable .

   # on windows, remove the --symlink flag and re-run the command each time you make changes
   jupyter-contrib-nbextension install --sys-prefix --symlink
   ```

## Create an extension

Add a folder with the name of your new extension to [jupyter_contrib_nbextensions/nbextensions](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions). Check out the [Jupyter Notebook extension structure link](http://jupyter-contrib-nbextensions.readthedocs.io/en/latest/internals.html) to know what has to be in that folder and what the general conventions are.

## Create a pull request

As you are ready with your code contribution, make a pull-request to the main repo and briefly explain what you have done.

Here is an example pull request of how @benelot did it that worked super well: [#1213](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1213)

Please also update the [unreleased section](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/blob/master/CHANGELOG.md#unreleased-aka-github-master) of the [CHANGELOG.md](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/blob/master/CHANGELOG.md) to note what you've added or fixed.
