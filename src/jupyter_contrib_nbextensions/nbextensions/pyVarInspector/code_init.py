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
def _tableRow(v):
    var = eval(v)
    return '<a href=\"#\" onClick=\"Jupyter.notebook.kernel.execute(\'del {4}\'); Jupyter.notebook.events.trigger(\'varRefresh\'); \">x</a></td><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}'.format(
     _trunc(v,lenName), _trunc(type(var).__name__,lenType), 
     _getsizeof(var), _trunc(str(var),lenVar), v)
def var_list():
    values = _nms.who_ls()
    _html = '<div class=\"inspector\"><table class=\"table fixed table-condensed table-nonfluid \"><col /> \
    <col  /><col /><thead><tr><th >X</th><th >Name</th><th >Type</th><th >Size</th><th >Value</th></tr></thead><tr><td>' + \
            '</td></tr><tr><td>'.join([ _tableRow(v) for v in values if (v not in ['_html', '_nms', 'NamespaceMagics', '_Jupyter']) & (type(eval(v)).__name__ not in types_to_exclude)]) + \
            '</td></tr></table></div>'
    return _html

def var_dic_list():
    types_to_exclude = ['module', 'function', 'builtin_function_or_method', 'instance', '_Feature']    
    values = _nms.who_ls()
    vardic = [{'varName':v, 'varType': type(eval(v)).__name__, 'varSize': _getsizeof(eval(v)), 'varContent': str(eval(v))[:200]} for v in 
    values if (v not in ['_html', '_nms', 'NamespaceMagics', '_Jupyter']) & (type(eval(v)).__name__ not in types_to_exclude)]   
    return json.dumps(vardic)  
     
print(var_dic_list())
