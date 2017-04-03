from __future__ import print_function
from sys import getsizeof
from IPython.core.magics.namespace import NamespaceMagics
_nms = NamespaceMagics()
_Jupyter = get_ipython()
_nms.shell = _Jupyter.kernel.shell
def _trunc(x,L): return x[:L-3]+'...' if len(x)>L else x[:L]
def _getsizeof(x):
   if type(x).__name__ in ['ndarray', 'Series']:  return x.nbytes
   elif type(x).__name__ == 'DataFrame': return x.memory_usage().sum()
   else: return getsizeof(x)

def var_dic_list():
    types_to_exclude = ['module', 'function', 'builtin_function_or_method', 'instance', '_Feature']    
    values = _nms.who_ls()
    vardic = [{'varName':v, 'varType': type(eval(v)).__name__, 'varSize': _getsizeof(eval(v)), 'varContent': str(eval(v))[:200]} for v in 
    values if (v not in ['_html', '_nms', 'NamespaceMagics', '_Jupyter']) & (type(eval(v)).__name__ not in types_to_exclude)]   
    return json.dumps(vardic)  
     
print(var_dic_list())
