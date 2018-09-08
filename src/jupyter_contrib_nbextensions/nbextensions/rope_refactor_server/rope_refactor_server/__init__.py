import json

from notebook.base.handlers import IPythonHandler
from notebook.utils import url_path_join
from rope.base.exceptions import RopeError

from .rope_refactor import extract_variable, rename, extract_method, inline


def get_absolute_character_position(complete_text, position_on_line, line):
    characters_before_line = 0
    if line > 0:
        for line_index in range(line):
            characters_before_line += len(complete_text[line_index])
    absolute_position = position_on_line + characters_before_line + 1
    return absolute_position


class RefactoringHandler(IPythonHandler):
    def data_received(self, chunk):
        print('test')
        pass

    def get(self):
        start_line = int(self.get_argument('start[line]'))
        start_ch = int(self.get_argument('start[ch]', None))
        end_line = int(self.get_argument('end[line]', None))
        end_ch = int(self.get_argument('end[ch]', None))
        new_name = self.get_argument('new_variable_name', None)
        code = json.loads(self.get_argument('code_to_refactor', None))
        code_as_list = code.split('\n')
        start = get_absolute_character_position(code_as_list, start_ch, start_line)
        end = get_absolute_character_position(code_as_list, end_ch, end_line)

        if start > end:
            end, start = start, end

        refactored_code = ""
        error = ""

        try:
            action = self.get_argument('action')
            if action == 'extract_variable':
                refactored_code = extract_variable(code, start, end, new_name)
            elif action == 'rename':
                refactored_code = rename(code, start, end, new_name)
            elif action == 'extract_method':
                refactored_code = extract_method(code, start, end, new_name)
            elif action == 'inline':
                refactored_code = inline(code, start)
        except RopeError as exception:
            error = exception.args[0]

        result = {"refactored_code": refactored_code, "error": error}
        self.finish(json.dumps(result))


def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.

    Args:
        nb_server_app (NotebookWebApplication): handle to the Notebook webserver instance.
    """
    web_app = nb_server_app.web_app
    host_pattern = '.*$'
    route_pattern = url_path_join(web_app.settings['base_url'], '/rope_refactoring')
    web_app.add_handlers(host_pattern, [(route_pattern, RefactoringHandler)])
    nb_server_app.log.info("rope_refactor_server module enabled!")


def _jupyter_server_extension_paths():
    return [{
        "module": "rope_refactor_server"}]


# Jupyter Extension points
def _jupyter_nbextension_paths():
    return [dict(section="notebook",  # the path is relative to the `rope_refactor_server` directory
        src="static",  # directory in the `nbextension/` namespace
        dest="rope_refactor_server",  # _also_ in the `nbextension/` namespace
        require="rope_refactor_server/static/index")]
