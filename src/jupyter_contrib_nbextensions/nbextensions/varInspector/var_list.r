library(jsonlite)
var_dic_list = function(){ 
    ll = ls(.GlobalEnv, all.names = FALSE)
    varList=list()
    iter = 1
        for (k in ll){
            if (class(get(k))!='function'){
            class = class(get(k)); rk = capture.output(str(get(k))); size =  object.size(get(k)); sk = substr(get(k),0, 200); 
            #  [{'varName':v, 'varType': type(eval(v)).__name__, 'varSize': _getsizeof(eval(v)), 'varContent': str(eval(v))[:200]} 
            l = list(varName = k, varType = class, varSize = size, varContent = sk)
            varList[[iter]] = l
            # print(l)
            iter = iter + 1}
        }
return(toJSON(varList, simplifyVector = FALSE, force=TRUE))
    }
cat(var_dic_list())