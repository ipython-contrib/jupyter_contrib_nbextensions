define([
  "base/js/namespace",
  "jquery",
  "codemirror/lib/codemirror",
  "./EN_dictionary",
  "require"
], function(Jupyter, $, CodeMirror, DICT) {
  "use strict";

  var checker = function() {
    var dict_obj = new DICT();
    var dict = dict_obj.get_dictionary();
    var word_list = [];
    var ed;
    var suggestion = {};

    checker.prototype.get_word_list = function(editor) {
      var select = document.getElementById("suggestions");
      var length = select.options.length;
      for (var i = 0; i < length; i++) {
        select.options[i] = null;
      }
      ed = editor;
      for (var i = 0; i < editor.lineCount(); i++) {
        var temp = editor.display.renderedView[i].measure.map[2].textContent;
        var line = temp.split(" ");
        word_list[i] = line;
      }
      this.find_error();
    };

    checker.prototype.find_error = function() {
      for (var i = 0; i < word_list.length; i++) {
        var after_check = this.check_word_arr(word_list[i]);
        var span = ed.display.renderedView[i].measure.map[2].parentNode;
        if (span != null) {
          span.innerHTML = after_check;
        }
      }
      for (var j = 0; j < Object.keys(suggestion).length; j++) {
        var key_temp = Object.keys(suggestion)[j];
        for (var k = 1; k < 4; k++) {
          var value_temp =
            suggestion[key_temp][suggestion[key_temp].length - k];
          var option = $("<option>", { value: value_temp }).text(
            key_temp + " --> " + value_temp
          );
          $("#suggestions").append(option);
        }
      }
    };

    checker.prototype.check_word_arr = function(word_arr) {
      if (word_arr == null) {
        return;
      }
      for (var i = 0; i < word_arr.length; i++) {
        if (!this.check_word(word_arr[i])) {
          word_arr[i] = "<b class='wrong-word'>" + word_arr[i] + "</b>";
        }
      }
      var res = word_arr.join(" ");
      return res;
    };

    checker.prototype.check_word = function(word) {
      if (word == null || word == " ") {
        return true;
      }
      word = word.replace(
        /[|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\、|\，|\；|\。|\？|\！|\“|\”|\‘|\’|\：|\（|\）|\─|\…|\—|\·|\《|\》]/g,
        ""
      );
      word = word.toLowerCase();
      var l = 0;
      var r = dict.length - 1;
      var mid;
      var neighbour = new Array();
      while (l <= r) {
        mid = parseInt((l + r) / 2);
        if (dict[mid] == word) {
          return true;
        } else if (dict[mid] < word) {
          l = mid + 1;
        } else {
          r = mid - 1;
        }
      }
      neighbour.push(dict[mid - 1]);
      neighbour.push(dict[mid]);
      neighbour.push(dict[mid + 1]);
      suggestion[word] = neighbour;
      return false;
    };

    checker.prototype.apply_change = function() {
      var wrong_word = document.getElementsByClassName("wrong-word");
      console.log(wrong_word);
      console.log(word_list);
    };
  };
  return checker;
});
