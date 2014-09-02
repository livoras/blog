(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CSSAmination, tl;

CSSAmination = require("./src/cssanim.coffee");

tl = new CSSAmination;

CSSAmination.set(".box", {
  "width": "50px",
  "height": "50px",
  "border": "1px solid #ccc",
  "position": "fixed",
  "top": "0px",
  "left": "0px"
});

tl = new CSSAmination;

tl.to(".box", 0.5, {
  "left": "50px",
  "top": "200px",
  "background-color": "red",
  "width": "50px",
  "height": "50px"
}).to(".box", 0.5, {
  "opacity": "0",
  "left": "50px",
  "background-color": "blue"
}).call((function(_this) {
  return function() {
    return console.log("FUCK");
  };
})(this)).to(".box", 1, {
  "opacity": "1",
  "left": "100px",
  "top": "0px"
}).to(".box1", 0.5, {
  "top": "200px",
  "background-color": "yellow"
}, "fuck").to(".box2", 0.5, {
  "top": "400px",
  "background-color": "green"
}, "fuck").set(".box2", {
  "border": "2px solid red"
}).to(".box", 1, {
  "left": "200px"
}).delay(2).to(".box2", 1, {
  "left": "150px"
}).delay(2).to(".box1", 1, {
  "left": "100px"
}).delay(2).to(".box3", 1, {
  "left": "50px",
  onComplete: function() {
    return console.log("fuck--");
  }
}).to(".box", 1, {
  "left": "0px",
  "top": "0px",
  width: "0px",
  height: "0px",
  ease: "ease-in-out"
}).call((function(_this) {
  return function() {
    return setTimeout(function() {
      return tl.start();
    });
  };
})(this));

document.getElementById("start").addEventListener("click", function() {
  return tl.start();
});

document.getElementById("stop").addEventListener("click", function() {
  return tl.stop();
});

document.getElementById("pause").addEventListener("click", function() {
  return tl.pause();
});

document.getElementById("resume").addEventListener("click", function() {
  return tl.resume();
});

tl.start();



},{"./src/cssanim.coffee":2}],2:[function(require,module,exports){
var CSSAmination, animate, camelize, clear, css, disableAnimation, enableAnimation, getDoms, processStateToStyle, set, setOrAnimate,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

getDoms = function(selector) {
  var doms;
  if (typeof selector === "string") {
    doms = document.querySelectorAll(selector);
    if (!doms) {
      throw "" + selector + " is empty";
    }
    doms = [].slice.call(doms, 0);
  } else if (selector[0]) {
    doms = [selector[0]];
  }
  return doms;
};

css = function(dom, style) {
  var key, value, _results;
  _results = [];
  for (key in style) {
    value = style[key];
    _results.push(dom.style[camelize(key)] = value);
  }
  return _results;
};

clear = function(selector) {
  var dom, _i, _len, _ref, _results;
  _ref = getDoms(selector);
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    dom = _ref[_i];
    _results.push(dom.style.cssText = "");
  }
  return _results;
};

set = function(selector, style) {
  var dom, doms, _i, _len, _results;
  doms = getDoms(selector);
  _results = [];
  for (_i = 0, _len = doms.length; _i < _len; _i++) {
    dom = doms[_i];
    _results.push(css(dom, style));
  }
  return _results;
};

camelize = function(str) {
  return str.replace(/-+(.)?/g, function(match, chr) {
    if (chr) {
      return chr.toUpperCase();
    } else {
      return "";
    }
  });
};

CSSAmination = (function() {
  function CSSAmination() {
    this.seq = [];
    this.labels = {};
    this.allSelectors = [];
  }

  CSSAmination.prototype.to = function(selector, secs, style, label) {
    var animationObj;
    this._addSelector(selector);
    animationObj = {
      selector: selector,
      secs: secs,
      style: style
    };
    if (label) {
      if (this.labels[label]) {
        this.labels[label].push(animationObj);
      } else {
        this.labels[label] = [animationObj];
        this.seq.push(label);
      }
    } else {
      this.seq.push(animationObj);
    }
    return this;
  };

  CSSAmination.prototype.set = function(selector, style, label) {
    var cssObj;
    this._addSelector(selector);
    cssObj = {
      selector: selector,
      style: style
    };
    if (label) {
      if (this.labels[label]) {
        this.labels[label].push(cssObj);
      } else {
        this.labels[label] = [cssObj];
        this.seq.push(label);
      }
    } else {
      this.seq.push(cssObj);
    }
    return this;
  };

  CSSAmination.prototype.delay = function(secs) {
    this.seq.push(secs);
    return this;
  };

  CSSAmination.prototype.call = function(fn) {
    this.seq.push(fn);
    return this;
  };

  CSSAmination.prototype.start = function() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.currentProgress = 0;
    this._loop();
    return this;
  };

  CSSAmination.prototype._loop = function() {
    var max, state, type, _i, _len, _loop, _ref;
    if (this.currentProgress === this.seq.length || this.forceStop) {
      this.isRunning = false;
      this.forceStop = false;
      return;
    }
    if (this.isPause) {
      return;
    }
    state = this.seq[this.currentProgress];
    this.currentProgress++;
    type = typeof state;
    _loop = (function(_this) {
      return function() {
        return _this._loop();
      };
    })(this);
    if (type === "number") {
      return setTimeout(_loop, state * 1000);
    } else if (type === "function") {
      state();
      return _loop();
    } else if (type === "string") {
      max = 0;
      _ref = this.labels[state];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        state = _ref[_i];
        max = state.secs > max ? state.secs : max;
        setOrAnimate(state);
      }
      return setTimeout(_loop, max * 1000);
    } else if (type === "object") {
      return setOrAnimate(state, _loop);
    }
  };

  CSSAmination.prototype.pause = function() {
    this.isPause = true;
    return this;
  };

  CSSAmination.prototype.resume = function() {
    if (!this.isPause) {
      return;
    }
    this.isPause = false;
    this._loop();
    return this;
  };

  CSSAmination.prototype.stop = function(isReset) {
    this.forceStop = true;
    this.isRunning = false;
    this.reset();
    return this;
  };

  CSSAmination.prototype.reset = function() {
    var selector;
    selector = this.allSelectors.join(", ");
    clear(selector);
    return this;
  };

  CSSAmination.prototype._addSelector = function(selector) {
    if (__indexOf.call(this.allSelectors, selector) < 0) {
      return this.allSelectors.push(selector);
    }
  };

  return CSSAmination;

})();

setOrAnimate = function(state, cb) {
  var _animate;
  _animate = function() {
    return animate(state, cb);
  };
  if (!state.secs) {
    set(state.selector, state.style);
    return typeof cb === "function" ? cb() : void 0;
  } else {
    if (!state.style.delay) {
      return _animate();
    } else {
      return setTimeout(_animate, state.style.delay);
    }
  }
};

animate = function(state, cb) {
  var dom, doms, style, _i, _len;
  doms = getDoms(state.selector);
  for (_i = 0, _len = doms.length; _i < _len; _i++) {
    dom = doms[_i];
    enableAnimation(dom, state.secs, state.style.ease);
    style = processStateToStyle(state.style);
    css(dom, style);
  }
  return setTimeout(function() {
    var _base, _j, _len1;
    for (_j = 0, _len1 = doms.length; _j < _len1; _j++) {
      dom = doms[_j];
      disableAnimation(dom);
    }
    if (typeof cb === "function") {
      cb();
    }
    return typeof (_base = state.style).onComplete === "function" ? _base.onComplete() : void 0;
  }, state.secs * 1000);
};

enableAnimation = function(dom, duration, ease) {
  ease = ease || "ease";
  dom.style.webkitTransform = "translateZ(0)";
  dom.style.webkitBackfaceVisibility = "hidden";
  dom.style.webkitPerspective = "1000";
  return dom.style.webkitTransition = "all " + duration + "s " + ease;
};

disableAnimation = function(dom) {
  dom.style.webKitTransition = "";
  return dom.style.transition = "";
};

processStateToStyle = function(style) {
  return style;
};

CSSAmination.set = set;

CSSAmination.clear = clear;

module.exports = CSSAmination;



},{}]},{},[1]);