Gist it
=======
Publish notebooks as Github gists with a single button click!


Authentication
--------------
The extension works with no special settings, publishing anonymous,
non-modifiable gists.

To create gists owned by your Github user, or to modify existing gists (useful
for multiple revisions of a notebook!), you need to be authenticate with Github.


### Anonymous
You can publish anonymous gists without any authentication (the default mode).
Anonymous gists can't be edited, so every time you click the button, a new gist
is created.



### Personal access tokens
At the moment, the only supported method of authentication is client-side,
using Github _personal access tokens_.

__Important:__ using personal access token authentication __only makes sense if
you are the only user of the notebook server__, and control the server.
Otherwise, other users of the server may use your token
(either accidentally or maliciously) to create/edit/delete gists,
or exercise any other permissions you might have given to the token.
If the server is only for your personal use, then you can create a github
personal access token at https://github.com/settings/tokens.
It makes sense to only grant the token the minimum permissions (scopes)
necessary for the extension to work, in this case, the `gists` scope.
Once you've got your token from Github, enter it on the
[extension configuration page](../../nbextensions#_nbext-ext-Gist-it) for it to
be stored in the server config.


### Full Github OAuth
Github's full OAuth authentication
(which would be required to make this extension useful for authenticating users
in a multi-notebook setup)
requires some server-side code.
There are some issues with implementing this directly (
essentially related to a secret which the App server must know, and can't be
published as part of open-source code, see [here]() for details
) as a Jupyter extension.
I ([@jcb91](https://github.com/jcb91)) started writing this `Gist it` extension
to work with a 3rd-party authentication app, but didn't finish it or test it,
so it's not functional at the moment.
If you'd like to have the full OAuth model, I'd be happy to help with any
attempt you make - drop me a line on Github.
