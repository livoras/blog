(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Cover, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

tpl = require("./cover.html");

Cover = (function(_super) {
  __extends(Cover, _super);

  function Cover() {
    this.tpl = tpl;
    this.data = {
      "title": "Fucking, Cover..."
    };
    this.render();
  }

  Cover.prototype.start = function() {
    var tl;
    tl = new TimelineMax;
    tl.to(this.$dom.find('div'), 1, {
      "y": 200
    });
    tl.to(this.$dom.find('div'), 0.5, {
      "x": 50
    });
    return this.$dom.on("tap", (function(_this) {
      return function() {
        return TweenLite.to(_this.$dom, 1, {
          "opacity": 0,
          "onComplete": function() {
            return _this.emit("done");
          }
        });
      };
    })(this));
  };

  return Cover;

})(LA.PageController);

LA.util.exports(Cover);

module.exports = Cover;



},{"./cover.html":2}],2:[function(require,module,exports){
module.exports = "<div class=\"inner-content inner-cover\">\r\n    <div class=\"padding\">\r\n        {{title}}\r\n    </div> \r\n</div>";

},{}]},{},[1]);