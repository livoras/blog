(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CURRENT_Z_INDEX, FancySlide, GAP, HEIGHT, WIDTH, gestureEvent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

gestureEvent = require("./gesture-event.coffee");

CURRENT_Z_INDEX = 100;

HEIGHT = window.innerHeight;

WIDTH = window.innerWidth;

GAP = HEIGHT * 0.3;

FancySlide = (function(_super) {
  __extends(FancySlide, _super);

  function FancySlide() {
    this.$progress = $("<ul id='slide-progress'></ul>");
    $("div.wrapper").append(this.$progress);
    this.curr = null;
    this.prev = null;
    this.next = null;
    this.prevTimeline = null;
    this.nextTimeline = null;
    this.able = false;
    this.isLoop = true;
    this.isReachEnd = false;
    this.isFirstSetCurr = true;
    this.isProgressShow = true;
    this.prevState = {
      y: -HEIGHT,
      ease: Linear.easeNone
    };
    this.currState = {
      y: 0,
      ease: Linear.easeNone
    };
    this.nextState = {
      y: HEIGHT,
      ease: Linear.easeNone
    };
    this.duration = 0.6;
  }

  FancySlide.prototype.initStates = function(prevState, currState, nextState) {
    if (prevState) {
      this.prevState = prevState;
    }
    if (currState) {
      this.currState = currState;
    }
    if (nextState) {
      return this.nextState = nextState;
    }
  };

  FancySlide.prototype.init = function(pages) {
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

  FancySlide.prototype.enable = function() {
    return this.able = true;
  };

  FancySlide.prototype.disable = function() {
    return this.able = false;
  };

  FancySlide.prototype.loop = function() {
    return this.isLoop = true;
  };

  FancySlide.prototype.unloop = function() {
    return this.isLoop = false;
  };

  FancySlide.prototype.showProgress = function() {
    this.isProgressShow = true;
    return this.$progress.show();
  };

  FancySlide.prototype.hideProgress = function() {
    this.isProgressShow = false;
    return this.$progress.hide();
  };

  FancySlide.prototype.setDuration = function(duration) {
    return this.duration = duration || this.duration;
  };

  FancySlide.prototype._makePageCurrent = function(page) {
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
      this.next.$container.show();
    }
    return this._remakeTimelines();
  };

  FancySlide.prototype._setCurr = function(page) {
    var $container;
    this.curr = page;
    $container = page.$container;
    $container.show();
    $container.css("zIndex", CURRENT_Z_INDEX);
    TweenMax.set($container, this.currState);
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

  FancySlide.prototype._setNext = function(page) {
    var $container;
    this.next = page;
    if (!this.next) {
      return;
    }
    $container = page.$container;
    $container.show();
    $container.css("zIndex", CURRENT_Z_INDEX + 1);
    TweenMax.set($container[0], this.nextState);
    return this.emit("deactive", page);
  };

  FancySlide.prototype._setPrev = function(page) {
    var $container;
    this.prev = page;
    if (!this.prev) {
      return;
    }
    $container = page.$container;
    $container.show();
    $container.css("zIndex", CURRENT_Z_INDEX - 1);
    TweenMax.set($container, this.prevState);
    return this.emit("deactive", page);
  };

  FancySlide.prototype._getPrevByIndex = function(index) {
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

  FancySlide.prototype._getNextByIndex = function(index) {
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

  FancySlide.prototype._remakeTimelines = function() {
    var ntl, ptl;
    if (this.next) {
      ntl = this.nextTimeline = new TimelineMax;
      ntl.to(this.curr.$container, this.duration, this.prevState, "next").to(this.next.$container, this.duration, this.currState, "next").call((function(_this) {
        return function() {
          return _this._makePageCurrent(_this.next);
        };
      })(this));
      ntl.pause();
    }
    if (this.prev) {
      ptl = this.prevTimeline = new TimelineMax;
      ptl.to(this.curr.$container, this.duration, this.nextState, "prev").to(this.prev.$container, this.duration, this.currState, "prev").call((function(_this) {
        return function() {
          return _this._makePageCurrent(_this.prev);
        };
      })(this));
      return ptl.pause();
    }
  };

  FancySlide.prototype._initEvents = function() {
    gestureEvent.on("swiping up", (function(_this) {
      return function(dist) {
        if (!_this.next || !_this.nextTimeline) {
          return;
        }
        if (_this._isTimelineActive()) {
          return;
        }
        _this.nextTimeline.pause();
        return _this.nextTimeline.progress(dist / HEIGHT);
      };
    })(this));
    gestureEvent.on("swipe up", (function(_this) {
      return function(dist, v) {
        if (!_this.next || !_this.nextTimeline) {
          return;
        }
        if (_this._isTimelineActive()) {
          return;
        }
        _this.nextTimeline.resume();
        if (dist > GAP || v > 1) {
          return _this.nextTimeline.play();
        } else {
          return _this.nextTimeline.reverse();
        }
      };
    })(this));
    gestureEvent.on("swiping down", (function(_this) {
      return function(dist) {
        if (!_this.prev || !_this.prevTimeline) {
          return;
        }
        if (_this._isTimelineActive()) {
          return;
        }
        _this.prevTimeline.pause();
        return _this.prevTimeline.progress(dist / HEIGHT);
      };
    })(this));
    return gestureEvent.on("swipe down", (function(_this) {
      return function(dist, v) {
        if (!_this.prev || !_this.prevTimeline) {
          return;
        }
        if (_this._isTimelineActive()) {
          return;
        }
        _this.prevTimeline.resume();
        if (dist > GAP || v > 1) {
          return _this.prevTimeline.play();
        } else {
          return _this.prevTimeline.reverse();
        }
      };
    })(this));
  };

  FancySlide.prototype._activeProgressByIndex = function(index) {
    $("#slide-progress li.active").removeClass("active");
    return $("#progress-" + index).addClass("active");
  };

  FancySlide.prototype._isTimelineActive = function() {
    if (this.nextTimeline && this.nextTimeline.isActive()) {
      return true;
    }
    if (this.prevTimeline && this.prevTimeline.isActive()) {
      return true;
    }
  };

  return FancySlide;

})(LA.SlideController);

LA.util.exports(FancySlide);

module.exports = FancySlide;



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
    return gestureEvent.emit("swipe up", absDistY, velocity);
  } else {
    return gestureEvent.emit("swipe down", absDistY, velocity);
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