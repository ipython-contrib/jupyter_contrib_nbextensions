# Contributing to jupyter notebook nbextensions

We are super happy that you intend to contribute to the nbextensions! You can discuss improvements in issues and implement them in pull requests.

## Create an issue

Do not hesitate to open up an issue, you can discuss bugs, improvements or new extensions in them. Creating an issue is a good starting point for code contributions. The community can support you with experience of similar extensions, pros and cons, what to look for etc.

Here is an example issue of how @benelot did it that worked pretty smoothly: [#1193](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/issues/1193)

## Setup development

1. __Fork and clone__
First fork this repo, then clone your fork. In this way you become prepared to make a pull request.

```shell
# clone your fork
git clone https://github.com/<your-github-username>/jupyter_contrib_nbextensions.git
cd jupyter_contrib_nbextensions
```
2. __Setup__
```shell
# run from the main directory, where setup.py is
pip install --editable .

# on windows, remove the --symlink flag and run the command in between changes
jupyter-contrib-nbextension install --sys-prefix --symlink 
```

## Create an extension

Add a folder with the name of your new extension to [jupyter_contrib_nbextensions/nbextensions](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions). Check out the [Jupyter Notebook extension structure link](http://jupyter-contrib-nbextensions.readthedocs.io/en/latest/internals.html) to know what has to be in that folder and what the general conventions are.

## Create a pull request

As you are ready with your code contribution, make a pull-request to the main repo and briefly explain what you have done.

Here is an example pull request of how @benelot did it that worked super well: [#1213](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/pull/1213)

Please also update the [CHANGELOG.md](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/blob/master/CHANGELOG.md).