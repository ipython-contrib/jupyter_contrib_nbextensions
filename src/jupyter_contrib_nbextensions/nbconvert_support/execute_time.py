"""
Module containing a preprocessor tto execute code cells, updating time metadata
"""

from datetime import datetime

from nbconvert.preprocessors.execute import ExecutePreprocessor

try:
    # notebook >= 5.0.0-rc1
    import notebook._tz as nbtz
except ImportError:
    # notebook < 5.0.0-rc1
    import notebook.services.contents.tz as nbtz


class ExecuteTimePreprocessor(ExecutePreprocessor):
    """
    Executes all the cells in a notebook, updating their ExecuteTime metadata.
    """

    def run_cell(self, cell, cell_index, *args, **kwargs):
        before = datetime.utcnow()
        exec_reply, outs = super(ExecuteTimePreprocessor, self).run_cell(
            cell, cell_index, *args, **kwargs)

        if exec_reply.get('msg_type', '') == 'execute_reply':
            ets = cell.setdefault('metadata', {}).setdefault('ExecuteTime', {})
            if 'started' in exec_reply.get('metadata', {}):
                # started value should is already a string, so don't isoformat
                ets['start_time'] = exec_reply['metadata']['started']
            else:
                # attempt to fallback to datetime obj for execution request msg
                ets['start_time'] = exec_reply.get(
                    'parent_header', {}).get('date', before).isoformat()
            ets['end_time'] = (
                exec_reply.get('header', {}).get('date') or nbtz.utcnow()
            ).isoformat()

        return exec_reply, outs
