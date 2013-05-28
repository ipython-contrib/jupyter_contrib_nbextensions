IPython-static-profiles
=======================

Some experiment with statics files. Clone this in your
`.ipython/profile_default/static/custom` and uncomment the extension you are
interested in in `custom/custom.js`.

This is a simple workaround until we ship IPyton with requirejs.

Install
=======

clone this repo into  `~/.ipython_/profile_xxx/static/`

```bash
git clone https://github.com/Carreau/ipython-static-profiles.git ~/.ipython/profile_default/static/custom
```

Edit `~/.ipython/profile_default/custom/custom.js` to your convenance. That is to say, uncomment
the extensions that interest you.

Restart your notebook server.

Details
=======

The `custom.js` file in this branch contain a small load_ext function to help
load extensions.  Extension can either be a folder named after the extension
containing a `main.js` script.  or a simple javascrip file. you can eithe load
an extension by name if it is in a folder, or by specyfying the full path if it
ends with .js


