define([
  "base/js/namespace",
  "jquery",
  "codemirror/lib/codemirror",
  "./EN_dictionary",
  "./typo",
  "notebook/js/textcell"
], function(Jupyter, $, CodeMirror, DICT, TYPO, textcell) {
  "use strict";

  var spc = function(eidtor) {
    var spc_name = "spc";
    var typo;
    var dic;
    var aff;
    var typo_list = new Array();
    var default_mode =
      textcell["MarkdownCell"]["options_default"]["cm_config"]["mode"];
    //The .dic file which is the list of words,
    //The .aff file which is a list of rules and other options
    spc.prototype.get_dictionary = function() {
      // var get_dic=new XMLHttpRequest();
      // get_dic.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.dic", true);
      // get_dic.onload=function(){
      //     if(get_dic.readyState===4&&get_dic.status===200){
      //         dic=get_dic.responseText;
      //     }
      //     else{
      //         console.log("dic get error "+get_dic.readyState+" "+get_dic.status);
      //     }
      // }
      // get_dic.send(null);
      // var get_aff=new XMLHttpRequest();
      // get_aff.open("GET","https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.aff",true);
      // get_aff.onload=function(){
      //     if(get_aff.readyState===4&&get_aff.status===200){
      //         aff=get_aff.responseText;
      //     }
      //     else{
      //         console.log("aff get error "+get_aff.readyState+" "+get_aff.status);
      //     }
      // }
      // get_aff.send(null);

      //Typo = function (dictionary, affData, wordsData, settings)
      typo = new TYPO("en_US", false, false, {
        platform: "any"
      });
    };

    spc.prototype.define_mode = function() {
      var symbols = ".,!@#$%^&*()_-+=|\\}{][;'/?<>\" ";
      CodeMirror.defineMode(spc_name, function(config) {
        var spc_mode = {
          name: spc_name,
          token: function(stream) {
            var ch = stream.peek();
            var word = "";
            if (symbols.includes(ch)) {
              stream.next();
              return null;
            }
            while ((ch = stream.peek()) != null && !symbols.includes(ch)) {
              word += ch;
              stream.next();
            }
            if (typo && !typo.check(word)) {
              typo_list.push(word);
              return "spell-error";
            }
            return null;
          }
        };
        return CodeMirror.overlayMode(
          CodeMirror.getMode(config, config.backdrop || "text/plain"),
          spc_mode,
          true
        );
      });
      return spc_name;
    };

    spc.prototype.get_suggestions = function() {
      var suggestions = new Array();
      for (var word in typo_list) {
        console.log(typo.suggest(typo_list[word])[0]);
      }
    };

    spc.prototype.default = function() {
      typo_list = [];
    };

    spc.prototype.toggle = function() {
      var cell_list = document.querySelectorAll(".CodeMirror");
      for (var i = 0; i < cell_list.length - 1; i++) {
        if (cell_list[i].CodeMirror.getMode()["name"] == "ipythongfm") {
          cell_list[i].CodeMirror.setOption("mode", spc_name);
        } else if (cell_list[i].CodeMirror.getMode()["name"] == spc_name) {
          cell_list[i].CodeMirror.setOption("mode", default_mode);
        }
      }
      var cur_mode =
        textcell["MarkdownCell"]["options_default"]["cm_config"]["mode"];
      textcell["MarkdownCell"]["options_default"]["cm_config"]["mode"] =
        cur_mode == spc_name ? default_mode : spc_name;
    };
  };
  return spc;
});
