# CodeMirrorSkill

This provides a *SKILL* mode for CodeMirror editor.
The `skill` module adds a MIME type `x-skill` and a mode `skill` that can then be used with CodeMirror.

# Usage
* Clone this repository as `~/.ipython/profile_default/static/cmMode` (or equivalent).
* Then, add this line to `~/.ipython/profile_default/static/custom/custom.js`
  
  `require(["cmMode/skill/skill"], function() {console.log("SKILL mode loaded");})`

* If you are using Jupyter and 
  [*nbextensions*](https://github.com/ipython-contrib/IPython-notebook-extensions),
  clone the repository as `~/.local/share/jupyter/nbextensions/cmMode` (or
  equivalent) and enable it (nbextensions page has more details on how to do this).

# License
   Copyright 2015 Ben Varkey Benjamin

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
