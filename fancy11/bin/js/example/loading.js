(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Loading, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

tpl = require("./loading.html");

Loading = (function(_super) {
  __extends(Loading, _super);

  function Loading() {
    this.tpl = tpl;
    this.data = {
      "text": "Loading..."
    };
    this.render();
  }

  Loading.prototype.dismiss = function() {
    var onComplete;
    onComplete = (function(_this) {
      return function() {
        return _this.emit("dismissed");
      };
    })(this);
    return TweenLite.to(this.$dom, 0.5, {
      "opacity": 0,
      onComplete: onComplete
    });
  };

  return Loading;

})(LA.LoadingController);

LA.util.exports(Loading);

module.exports = Loading;



},{"./loading.html":2}],2:[function(require,module,exports){
module.exports = "<div class=\"inner-content loading\">\r\n    <div class=\"padding\">{{text}}</div>\r\n</div>";

},{}]},{},[1]);