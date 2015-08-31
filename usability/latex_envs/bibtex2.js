// Issues:
//  no comment handling within strings
//  no string concatenation
//  no variable values yet

// Grammar implemented here:
//  bibtex -> (string | preamble | comment | entry)*;
//  string -> '@STRING' '{' key_equals_value '}';
//  preamble -> '@PREAMBLE' '{' value '}';
//  comment -> '@COMMENT' '{' value '}';
//  entry -> '@' key '{' key ',' key_value_list '}';
//  key_value_list -> key_equals_value (',' key_equals_value)*;
//  key_equals_value -> key '=' value;
//  value -> value_quotes | value_braces | key;
//  value_quotes -> '"' .*? '"'; // not quite
//  value_braces -> '{' .*? '"'; // not quite

// small modificaion to keep the type of the bibtex entry in the returned object (jfb/08-2015)

function BibtexParser() {
  this.pos = 0;
  this.input = "";
  
  this.entries = {};
  this.strings = {
      JAN: "January",
      FEB: "February",
      MAR: "March",      
      APR: "April",
      MAY: "May",
      JUN: "June",
      JUL: "July",
      AUG: "August",
      SEP: "September",
      OCT: "October",
      NOV: "November",
      DEC: "December"
  };
  this.currentKey = "";
  this.currentEntry = "";
  

  this.setInput = function(t) {
    this.input = t || "";
  }
  
  this.getEntries = function() {
      return this.entries;
  }

  this.isWhitespace = function(s) {
    return (s == ' ' || s == '\r' || s == '\t' || s == '\n');
  }

  this.match = function(s) {
    this.skipWhitespace();
    if (this.input.substring(this.pos, this.pos+s.length) == s) {
      this.pos += s.length;
    } else {
      throw "Token mismatch, expected " + s + ", found " + this.input.substring(this.pos);
    }
    this.skipWhitespace();
  }

  this.tryMatch = function(s) {
    this.skipWhitespace();
    if (this.input.substring(this.pos, this.pos+s.length) == s) {
      return true;
    } else {
      return false;
    }
    this.skipWhitespace();
  }

  this.skipWhitespace = function() {
    while (this.isWhitespace(this.input[this.pos])) {
      this.pos++;
    }
    if (this.input[this.pos] == "%") {
      while(this.input[this.pos] != "\n") {
        this.pos++;
      }
      this.skipWhitespace();
    }
  }

  this.value_braces = function() {
    var bracecount = 0;
    this.match("{");
    var start = this.pos;
    while(true) {
      if (this.input[this.pos] == '}' && this.input[this.pos-1] != '\\') {
        if (bracecount > 0) {
          bracecount--;
        } else {
          var end = this.pos;
          this.match("}");
          return this.input.substring(start, end);
        }
      } else if (this.input[this.pos] == '{') {
        bracecount++;
      } else if (this.pos == this.input.length-1) {
        throw "Unterminated value";
      }
      this.pos++;
    }
  }

  this.value_quotes = function() {
    this.match('"');
    var start = this.pos;
    while(true) {
      if (this.input[this.pos] == '"' && this.input[this.pos-1] != '\\') {
          var end = this.pos;
          this.match('"');
          return this.input.substring(start, end);
      } else if (this.pos == this.input.length-1) {
        throw "Unterminated value:" + this.input.substring(start);
      }
      this.pos++;
    }
  }
  
  this.single_value = function() {
    var start = this.pos;
    if (this.tryMatch("{")) {
      return this.value_braces();
    } else if (this.tryMatch('"')) {
      return this.value_quotes();
    } else {
      var k = this.key();
      if (this.strings[k.toUpperCase()]) {
        return this.strings[k];
      } else if (k.match("^[0-9]+$")) {
        return k;
      } else {
        throw "Value expected:" + this.input.substring(start);
      }
    }
  }
  
  this.value = function() {
    var values = [];
    values.push(this.single_value());
    while (this.tryMatch("#")) {
      this.match("#");
      values.push(this.single_value());
    }
    return values.join("");
  }

  this.key = function() {
    var start = this.pos;
    while(true) {
      if (this.pos == this.input.length) {
        throw "Runaway key";
      }
    
      if (this.input[this.pos].match("[a-zA-Z0-9_:\\./-]")) {
        this.pos++
      } else {
        return this.input.substring(start, this.pos).toUpperCase();
      }
    }
  }

  this.key_equals_value = function() {
    var key = this.key();
    if (this.tryMatch("=")) {
      this.match("=");
      var val = this.value();
      return [ key, val ];
    } else {
      throw "... = value expected, equals sign missing:" + this.input.substring(this.pos);
    }
  }

  this.key_value_list = function() {
    var kv = this.key_equals_value();
    this.entries[this.currentEntry][kv[0]] = kv[1];
    while (this.tryMatch(",")) {
      this.match(",");
      // fixes problems with commas at the end of a list
      if (this.tryMatch("}")) {
        break;
      }
      kv = this.key_equals_value();
      this.entries[this.currentEntry][kv[0]] = kv[1];
    }
  }

  this.entry_body = function(d) {
    this.currentEntry = this.key();
    this.entries[this.currentEntry] = new Object(); 
	this.entries[this.currentEntry]['reftype'] =  d.substring(1);
    this.match(",");
    this.key_value_list();
  }

  this.directive = function () {
    this.match("@");
    return "@"+this.key();
  }

  this.string = function () {
    var kv = this.key_equals_value();
    this.strings[kv[0].toUpperCase()] = kv[1];
  }

  this.preamble = function() {
    this.value();
  }

  this.comment = function() {
    this.value(); // this is wrong
  }

  this.entry = function(d) {
    this.entry_body(d);
  }

  this.bibtex = function() {
    while(this.tryMatch("@")) {
      var d = this.directive().toUpperCase();
      this.match("{");
      if (d == "@STRING") {
        this.string();
      } else if (d == "@PREAMBLE") {
        this.preamble();
      } else if (d == "@COMMENT") {
        this.comment();
      } else {
        this.entry(d);
      }
      this.match("}");
    }
  }
}

function BibtexDisplay() {
  this.fixValue = function (value) {
    value = value.replace(/\\glqq\s?/g, "&bdquo;");
    value = value.replace(/\\grqq\s?/g, '&rdquo;');
    value = value.replace(/\\ /g, '&nbsp;');
    value = value.replace(/\\url/g, '');
    value = value.replace(/---/g, '&mdash;');
    value = value.replace(/{\\"a}/g, '&auml;');
    value = value.replace(/\{\\"o\}/g, '&ouml;');
    value = value.replace(/{\\"u}/g, '&uuml;');
    value = value.replace(/{\\"A}/g, '&Auml;');
    value = value.replace(/{\\"O}/g, '&Ouml;');
    value = value.replace(/{\\"U}/g, '&Uuml;');
    value = value.replace(/\\ss/g, '&szlig;');
    value = value.replace(/\{(.*?)\}/g, '$1');
    return value;
  }
  
  this.displayBibtex2 = function(i, o) {
    var b = new BibtexParser();
    b.setInput(i);
    b.bibtex();

    var e = b.getEntries();
    var old = o.find("*");
  
    for (var item in e) {
      var tpl = $(".bibtex_template").clone().removeClass('bibtex_template');
      tpl.addClass("unused");
      
      for (var key in e[item]) {
      
        var fields = tpl.find("." + key.toLowerCase());
        for (var i = 0; i < fields.size(); i++) {
          var f = $(fields[i]);
          f.removeClass("unused");
          var value = this.fixValue(e[item][key]);
          if (f.is("a")) {
            f.attr("href", value);
          } else {
            var currentHTML = f.html() || "";
            if (currentHTML.match("%")) {
              // "complex" template field
              f.html(currentHTML.replace("%", value));
            } else {
              // simple field
              f.html(value);
            }
          }
        }
      }
    
      var emptyFields = tpl.find("span .unused");
      emptyFields.each(function (key,f) {
        if (f.innerHTML.match("%")) {
          f.innerHTML = "";
        }
      });
    
      o.append(tpl);
      tpl.show();
    }
    
    old.remove();
  }


  this.displayBibtex = function(input, output) {
    // parse bibtex input
    var b = new BibtexParser();
    b.setInput(input);
    b.bibtex();
    
    // save old entries to remove them later
    var old = output.find("*");    

    // iterate over bibTeX entries
    var entries = b.getEntries();
    for (var entryKey in entries) {
      var entry = entries[entryKey];
      
      // find template
      var tpl = $(".bibtex_template").clone().removeClass('bibtex_template');
      
      // find all keys in the entry
      var keys = [];
      for (var key in entry) {
        keys.push(key.toUpperCase());
      }
      
      // find all ifs and check them
      var removed = false;
      do {
        // find next if
        var conds = tpl.find(".if");
        if (conds.size() == 0) {
          break;
        }
        
        // check if
        var cond = conds.first();
        cond.removeClass("if");
        var ifTrue = true;
        var classList = cond.attr('class').split(' ');
        $.each( classList, function(index, cls){
          if(keys.indexOf(cls.toUpperCase()) < 0) {
            ifTrue = false;
          }
          cond.removeClass(cls);
        });
        
        // remove false ifs
        if (!ifTrue) {
          cond.remove();
        }
      } while (true);
      
      // fill in remaining fields 
      for (var index in keys) {
        var key = keys[index];
        var value = entry[key] || "";
        tpl.find("span:not(a)." + key.toLowerCase()).html(this.fixValue(value));
        tpl.find("a." + key.toLowerCase()).attr('href', this.fixValue(value));
      }
      
      output.append(tpl);
      tpl.show();
    }
    
    // remove old entries
    old.remove();
  }

}

function bibtex_js_draw() {
  $(".bibtex_template").hide();
  (new BibtexDisplay()).displayBibtex($("#bibtex_input").val(), $("#bibtex_display"));
}

// check whether or not jquery is present
if (typeof jQuery == 'undefined') {  
  // an interesting idea is loading jquery here. this might be added
  // in the future.
  alert("Please include jquery in all pages using bibtex_js!");
} else {
  // draw bibtex when loaded
  $(document).ready(function () {
    // check for template, add default
    if ($(".bibtex_template").size() == 0) {
      $("body").append("<div class=\"bibtex_template\"><div class=\"if author\" style=\"font-weight: bold;\">\n  <span class=\"if year\">\n    <span class=\"year\"></span>, \n  </span>\n  <span class=\"author\"></span>\n  <span class=\"if url\" style=\"margin-left: 20px\">\n    <a class=\"url\" style=\"color:black; font-size:10px\">(view online)</a>\n  </span>\n</div>\n<div style=\"margin-left: 10px; margin-bottom:5px;\">\n  <span class=\"title\"></span>\n</div></div>");
    }

    bibtex_js_draw();
  });
}
