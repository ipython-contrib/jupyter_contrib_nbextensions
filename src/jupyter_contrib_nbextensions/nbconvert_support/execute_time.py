"""
Module containing a preprocessor tto execute code cells, updating time metadata
"""

from datetime import datetime

from nbconvert.preprocessors.execute import ExecutePreprocessor


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
                # started value should is already a string
                ets['start_time'] = exec_reply['metadata']['started']
            else:
                # attempt to fallback to datetime obj for execution request msg
                ets['start_time'] = exec_reply.get('parent_header', {}).get(
                    'date', before).isoformat()
            ets['end_time'] = (exec_reply.get('header', {}).get(
                'date', None) or datetime.utcnow()).isoformat()

        return exec_reply, outs
