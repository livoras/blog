(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CURRENT_Z_INDEX, EasySlide, GAP, HEIGHT, WIDTH, css, gestureEvent, setY,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

gestureEvent = require("./gesture-event.coffee");

CURRENT_Z_INDEX = 100;

HEIGHT = window.innerHeight;

WIDTH = window.innerWidth;

GAP = 0.3 * HEIGHT;

css = function($dom, style) {
  var key, value, _results;
  _results = [];
  for (key in style) {
    value = style[key];
    if (key === "y") {
      _results.push(setY($dom, value));
    } else {
      _results.push($dom.css(key, value));
    }
  }
  return _results;
};

setY = function($dom, y) {
  var param;
  if (typeof y === "string" && $dom.y) {
    param = y[0] === "+" ? 1 : -1;
    y = $dom.y + param * (parseInt(y.slice(2)));
  }
  $dom[0].style.webkitTransform = "translateY(" + y + "px)";
  return $dom.y = y;
};

EasySlide = (function(_super) {
  __extends(EasySlide, _super);

  function EasySlide() {
    this.$progress = $("<ul id='slide-progress'></ul>");
    $("div.wrapper").append(this.$progress);
    this.curr = null;
    this.prev = null;
    this.next = null;
    this.able = false;
    this.isLoop = true;
    this.isReachEnd = false;
    this.isFirstSetCurr = true;
    this.isProgressShow = true;
    this.prevState = {
      y: -HEIGHT
    };
    this.currState = {
      y: 0
    };
    this.nextState = {
      y: HEIGHT
    };
    this.duration = 1;
    this.isAnimating = false;
    this.isFast = false;
  }

  EasySlide.prototype.init = function(pages) {
    this.pages = pages;
    this.pages.forEach((function(_this) {
      return function(page, i) {
        page.$container.hide();
        page.pageIndex = i;
        return _this.$progress.append($("<li id='progress-" + i + "'></li>"));
      };
    })(this));
    this._makePageCurrent(pages[0]);
    return this._initEvents();
  };

  EasySlide.prototype.enable = function() {
    return this.able = true;
  };

  EasySlide.prototype.disable = function() {
    return this.able = false;
  };

  EasySlide.prototype.loop = function() {
    return this.isLoop = true;
  };

  EasySlide.prototype.unloop = function() {
    return this.isLoop = false;
  };

  EasySlide.prototype.showProgress = function() {
    this.isProgressShow = true;
    return this.$progress.show();
  };

  EasySlide.prototype.hideProgress = function() {
    this.isProgressShow = false;
    return this.$progress.hide();
  };

  EasySlide.prototype.setDuration = function(duration) {
    return this.duration = duration || this.duration;
  };

  EasySlide.prototype.fast = function() {
    return this.isFast = true;
  };

  EasySlide.prototype.unfast = function() {
    return this.isFast = false;
  };

  EasySlide.prototype._makePageCurrent = function(page) {
    var next, prev;
    prev = this._getPrevByIndex(page.pageIndex);
    next = this._getNextByIndex(page.pageIndex);
    if (this.prev) {
      this.prev.$container.hide();
    }
    this._setCurr(page);
    this._setPrev(prev);
    this._setNext(next);
    if (this.next) {
      return this.next.$container.show();
    }
  };

  EasySlide.prototype._setCurr = function(page) {
    var $container;
    this.curr = page;
    $container = page.$container;
    $container.show();
    $container.css("zIndex", CURRENT_Z_INDEX);
    css($container, this.currState);
    if (this.isProgressShow) {
      this._activeProgressByIndex(page.pageIndex);
    }
    if (page.pageIndex === this.pages.length - 1) {
      this.isReachEnd = true;
    }
    if (this.isFirstSetCurr) {
      return this.isFirstSetCurr = false;
    }
    return this.emit("active", page);
  };

  EasySlide.prototype._setNext = function(page) {
    var $container;
    this.next = page;
    if (!this.next) {
      return;
    }
    $container = page.$container;
    $container.show();
    $container.css("zIndex", CURRENT_Z_INDEX + 1);
    css($container, this.nextState);
    return this.emit("deactive", page);
  };

  EasySlide.prototype._setPrev = function(page) {
    var $container;
    this.prev = page;
    if (!this.prev) {
      return;
    }
    $container = page.$container;
    $container.show();
    $container.css("zIndex", CURRENT_Z_INDEX - 1);
    css($container, this.prevState);
    return this.emit("deactive", page);
  };

  EasySlide.prototype._getPrevByIndex = function(index) {
    var prevIndex;
    prevIndex = index - 1;
    if (prevIndex >= 0) {
      return this.pages[prevIndex];
    } else {
      if (this.isLoop && this.isReachEnd) {
        return this.pages[this.pages.length - 1];
      } else {
        return null;
      }
    }
  };

  EasySlide.prototype._getNextByIndex = function(index) {
    var nextIndex;
    nextIndex = index + 1;
    if (nextIndex < this.pages.length) {
      return this.pages[nextIndex];
    } else {
      if (this.isLoop) {
        return this.pages[0];
      } else {
        return null;
      }
    }
  };

  EasySlide.prototype._initEvents = function() {
    gestureEvent.on("swiping up", (function(_this) {
      return function(dist) {
        if (!_this.next || !_this.able || _this.isAnimating) {
          return;
        }
        setY(_this.next.$container, HEIGHT - dist);
        return setY(_this.curr.$container, -dist);
      };
    })(this));
    gestureEvent.on("swipe up", (function(_this) {
      return function(dist, v, distTime) {
        var currentProgress, duration, isRun;
        if (!_this.next || !_this.able || _this.isAnimating) {
          return;
        }
        isRun = false;
        currentProgress = dist / HEIGHT;
        if (dist > GAP || v > 1) {
          isRun = true;
          duration = (1 - currentProgress) * _this.duration;
          if (_this.isFast && v > 2) {
            duration = 0.15;
          }
          _this._enableAnimation(duration);
          css(_this.curr.$container, _this.prevState);
          css(_this.next.$container, _this.currState);
        } else {
          duration = 0.5;
          _this._enableAnimation(duration);
          css(_this.curr.$container, _this.currState);
          css(_this.next.$container, _this.nextState);
        }
        return setTimeout(function() {
          _this._disableAnimation();
          if (isRun) {
            return _this._makePageCurrent(_this.next);
          }
        }, duration * 1.1 * 1000);
      };
    })(this));
    gestureEvent.on("swiping down", (function(_this) {
      return function(dist) {
        if (!_this.prev || !_this.able || _this.isAnimating) {
          return;
        }
        setY(_this.prev.$container, -HEIGHT + dist);
        return setY(_this.curr.$container, dist);
      };
    })(this));
    return gestureEvent.on("swipe down", (function(_this) {
      return function(dist, v, distTime) {
        var currentProgress, duration, isRun;
        if (!_this.prev || !_this.able || _this.isAnimating) {
          return;
        }
        isRun = false;
        currentProgress = dist / HEIGHT;
        if (dist > GAP || v > 1) {
          isRun = true;
          duration = (1 - currentProgress) * _this.duration;
          if (_this.isFast && v > 2) {
            duration = 0.15;
          }
          _this._enableAnimation(duration);
          css(_this.curr.$container, _this.nextState);
          css(_this.prev.$container, _this.currState);
        } else {
          duration = 0.5;
          _this._enableAnimation(duration);
          css(_this.curr.$container, _this.currState);
          css(_this.prev.$container, _this.prevState);
        }
        return setTimeout(function() {
          _this._disableAnimation();
          if (isRun) {
            return _this._makePageCurrent(_this.prev);
          }
        }, duration * 1000);
      };
    })(this));
  };

  EasySlide.prototype._activeProgressByIndex = function(index) {
    $("#slide-progress li.active").removeClass("active");
    return $("#progress-" + index).addClass("active");
  };

  EasySlide.prototype._enableAnimation = function(duration) {
    var cssStr;
    this.isAnimating = true;
    cssStr = "all " + duration + "s ease-out";
    if (this.curr) {
      this.curr.$container[0].style.webkitTransition = cssStr;
    }
    if (this.prev) {
      this.prev.$container[0].style.webkitTransition = cssStr;
    }
    if (this.next) {
      return this.next.$container[0].style.webkitTransition = cssStr;
    }
  };

  EasySlide.prototype._disableAnimation = function() {
    this.isAnimating = false;
    if (this.curr) {
      this.curr.$container[0].style.webkitTransition = "";
    }
    if (this.prev) {
      this.prev.$container[0].style.webkitTransition = "";
    }
    if (this.next) {
      return this.next.$container[0].style.webkitTransition = "";
    }
  };

  return EasySlide;

})(LA.SlideController);

LA.util.exports(EasySlide);

module.exports = EasySlide;



},{"./gesture-event.coffee":2}],2:[function(require,module,exports){
var $window, currentPos, gestureEvent, getPos, startPos, startTime;

gestureEvent = new EventEmitter2;

$window = $(window);

currentPos = null;

startPos = null;

startTime = null;

$window.on("touchstart", function(event) {
  var pos;
  startTime = +(new Date);
  startPos = currentPos = pos = getPos(event);
  return gestureEvent.emit("touchstart", currentPos);
});

$window.on("touchmove", function(event) {
  var absDistY, distY, pos;
  currentPos = pos = getPos(event);
  gestureEvent.emit("touchstart", currentPos);
  distY = currentPos.y - startPos.y;
  absDistY = Math.abs(distY);
  if (distY < 0) {
    return gestureEvent.emit("swiping up", absDistY);
  } else {
    return gestureEvent.emit("swiping down", absDistY);
  }
});

$window.on("touchend", function(event) {
  var absDistY, currentTime, distTime, distY, velocity;
  gestureEvent.emit("touchend", currentPos);
  currentTime = +(new Date);
  distTime = currentTime - startTime;
  distY = currentPos.y - startPos.y;
  absDistY = Math.abs(distY);
  velocity = absDistY / distTime;
  if (distY < 0) {
    return gestureEvent.emit("swipe up", absDistY, velocity, distTime);
  } else {
    return gestureEvent.emit("swipe down", absDistY, velocity, distTime);
  }
});

getPos = function(event) {
  var x, y;
  x = event.clientX || event.touches[0].clientX;
  y = event.clientY || event.touches[0].clientY;
  return {
    x: x,
    y: y
  };
};

module.exports = gestureEvent;



},{}]},{},[1]);