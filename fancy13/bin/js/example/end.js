(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var EndPage, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

tpl = require("./end.html");

EndPage = (function(_super) {
  __extends(EndPage, _super);

  function EndPage(data) {
    this.tpl = tpl;
    this.data = data || {};
    this.render();
    this.$padding = this.$dom.find("div.padding");
    this._reset();
  }

  EndPage.prototype.start = function() {
    return TweenMax.to(this.$padding, 1, {
      x: 0,
      autoAlpha: 1,
      ease: Elastic.easeInOut
    });
  };

  EndPage.prototype.stop = function() {
    return this._reset();
  };

  EndPage.prototype._reset = function() {
    return TweenMax.set(this.$padding, {
      x: 100,
      autoAlpha: 0
    });
  };

  return EndPage;

})(LA.PageController);

LA.util.exports(EndPage);

module.exports = EndPage;



},{"./end.html":2}],2:[function(require,module,exports){
module.exports = "<div class=\"inner-content end\">\r\n    <div class=\"padding vertical\">\r\n        Our Happy Ending.{{name}}\r\n    </div>\r\n</div>";

},{}]},{},[1]);