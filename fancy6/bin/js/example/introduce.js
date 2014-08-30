(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var IntroducePage, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

tpl = require("./introduce.html");

IntroducePage = (function(_super) {
  __extends(IntroducePage, _super);

  function IntroducePage(data) {
    this.tpl = tpl;
    this.data = data || {};
    this.tl = new TimelineMax;
    this.render();
    this.$padding = this.$dom.find("div.padding");
    this.tl.to(this.$padding, 0.5, {
      "x": 0,
      "autoAlpha": 0.5
    });
    this.tl.to(this.$padding, 0.5, {
      "y": -20,
      "autoAlpha": 1
    });
    this.stop();
  }

  IntroducePage.prototype.start = function() {
    return this.tl.restart();
  };

  IntroducePage.prototype.stop = function() {
    this.tl.kill();
    return this._reset();
  };

  IntroducePage.prototype._reset = function() {
    return TweenMax.set(this.$padding, {
      "x": -300,
      "autoAlpha": 0
    });
  };

  return IntroducePage;

})(LA.PageController);

LA.util.exports(IntroducePage);

module.exports = IntroducePage;



},{"./introduce.html":2}],2:[function(require,module,exports){
module.exports = "<div class=\"inner-content introduce\">\r\n    <div class=\"padding vertical\">\r\n        {{title}}{{name}}\r\n    </div>\r\n</div>";

},{}]},{},[1]);