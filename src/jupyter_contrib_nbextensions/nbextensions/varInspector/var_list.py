import json
from sys import getsizeof

from IPython import get_ipython
from IPython.core.magics.namespace import NamespaceMagics
_nms = NamespaceMagics()
_Jupyter = get_ipython()
_nms.shell = _Jupyter.kernel.shell

has_numpy = False
try:
    import numpy as np
    has_numpy = True
except ImportError:
    has_numpy = False

def _getsizeof(x):
    # return the size of variable x. Amended version of sys.getsizeof
    # which also supports ndarray, Series and DataFrame
    if type(x).__name__ in ['ndarray', 'Series']:
        return x.nbytes
    elif type(x).__name__ == 'DataFrame':
        return x.memory_usage().sum()
    else:
        return getsizeof(x)

def _getshapeof(x):
    #returns the shape of x if it has one
    #returns None otherwise - might want to return an empty string for an empty collum
    global has_numpy
    if has_numpy:
        try:
            return x.shape
        except AttributeError: #x does not have a shape
            return ''

def var_dic_list():
    types_to_exclude = ['module', 'function', 'builtin_function_or_method',
                        'instance', '_Feature', 'type', 'ufunc']
    values = _nms.who_ls()
    vardic = [{'varName': v, 'varType': type(eval(v)).__name__, 'varSize': str(_getsizeof(eval(v))), 'varContent': str(eval(v))[:200]}  # noqa
    if has_numpy:
        vardic['varSize'] = str(eval(_getshapeof(v)))
    
    for v in values if (v not in ['_html', '_nms', 'NamespaceMagics', '_Jupyter']) & (type(eval(v)).__name__ not in types_to_exclude)] # noqa 
    return json.dumps(vardic)


# command to refresh the list of variables
print(var_dic_list())
