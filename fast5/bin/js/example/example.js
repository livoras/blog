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

},{}],3:[function(require,module,exports){
var $, Cover, HEIGHT, IntroducePage, Loading, Slide, core, log, pages, run, _ref;

_ref = LA.util, $ = _ref.$, log = _ref.log;

Loading = require("./loading/loading.coffee");

Cover = require("./cover/cover.coffee");

Slide = require("./fancy-slide/fancy-slide.coffee");

IntroducePage = require("./pages/introduce/introduce.coffee");

core = LA.core;

pages = [
  {
    title: "Who the fuck you are? ",
    name: "Harry?",
    bg: "example/assets/img/bg.jpg"
  }, {
    title: "I am ",
    name: "Lucy.",
    bg: "example/assets/img/end.jpg"
  }, {
    title: "No, you are ",
    name: "Tony.",
    bg: "example/assets/img/appBg2.jpg"
  }, {
    title: "FUCK YOU!!!!!!!!!",
    name: "Tony.",
    bg: "http://wx.nen.com.cn/imagelist/11/24/85715iy4e5h2.jpg"
  }
];

HEIGHT = window.innerHeight;

run = function() {
  var cover, loading, pageData, slide, _i, _len;
  TweenLite.set("body", {
    "backgroundColor": "#444"
  });
  loading = new Loading;
  cover = new Cover;
  for (_i = 0, _len = pages.length; _i < _len; _i++) {
    pageData = pages[_i];
    core.addPage(new IntroducePage(pageData));
  }
  slide = new Slide;
  slide.initStates({
    y: 0,
    scale: 0.5,
    rotationZ: 90,
    autoAlpha: 0,
    transformOrigin: "50% 50%"
  }, {
    y: 0,
    scale: 1,
    autoAlpha: 1,
    rotationZ: 0,
    transformOrigin: "50% 50%"
  }, {
    y: HEIGHT,
    scale: 1,
    autoAlpha: 0,
    rotationZ: 0,
    transformOrigin: "50% 50%"
  });
  slide.setDuration(1);
  slide.fast();
  core.setSlide(slide);
  loading.dismiss();
  return core.start();
};

run();



},{"./cover/cover.coffee":1,"./fancy-slide/fancy-slide.coffee":4,"./loading/loading.coffee":6,"./pages/introduce/introduce.coffee":8}],4:[function(require,module,exports){
var CURRENT_Z_INDEX, FancySlide, GAP, HEIGHT, WIDTH, gestureEvent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

gestureEvent = require("./gesture-event.coffee");

CURRENT_Z_INDEX = 100;

HEIGHT = window.innerHeight;

WIDTH = window.innerWidth;

GAP = 0.3 * HEIGHT;

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
    this.ease = Linear.easeNone;
    this.prevState = {
      y: -HEIGHT,
      ease: this.ease
    };
    this.currState = {
      y: 0,
      ease: this.ease
    };
    this.nextState = {
      y: HEIGHT,
      ease: this.ease
    };
    this.duration = 1;
    this.isAnimating = false;
    this.isFast = false;
  }

  FancySlide.prototype.initStates = function(prevState, currState, nextState) {
    if (prevState) {
      this.prevState = prevState;
    }
    if (currState) {
      this.currState = currState;
    }
    if (nextState) {
      this.nextState = nextState;
    }
    if (!this.prevState.ease) {
      this.prevState.ease = this.ease;
    }
    if (!this.currState.ease) {
      this.currState.ease = this.ease;
    }
    if (!this.nextState.ease) {
      return this.nextState.ease = this.ease;
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

  FancySlide.prototype.fast = function() {
    return this.isFast = true;
  };

  FancySlide.prototype.unfast = function() {
    return this.isFast = false;
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
    TweenLite.set($container, this.currState);
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
    TweenLite.set($container[0], this.nextState);
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
    TweenLite.set($container, this.prevState);
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
      ntl = this.nextTimeline = new TimelineLite;
      ntl.to(this.curr.$container, this.duration, this.prevState, "next").to(this.next.$container, this.duration, this.currState, "next");
      ntl.stop();
    }
    if (this.prev) {
      ptl = this.prevTimeline = new TimelineLite;
      ptl.to(this.curr.$container, this.duration, this.nextState, "prev").to(this.prev.$container, this.duration, this.currState, "prev");
      return ptl.stop();
    }
  };

  FancySlide.prototype._initEvents = function() {
    var swiped, swiping;
    swiping = (function(_this) {
      return function(timeline, page, dist) {
        if (!page || !timeline) {
          return;
        }
        if (!_this.able || _this.isAnimating) {
          return;
        }
        if (_this._isTimelineActive()) {
          return;
        }
        return timeline.progress(dist / HEIGHT);
      };
    })(this);
    swiped = (function(_this) {
      return function(timeline, page, dist, v, distTime) {
        var currentProgress, duration, isRun;
        if (!page || !timeline) {
          return;
        }
        if (!_this.able || _this.isAnimating) {
          return;
        }
        if (_this._isTimelineActive()) {
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
          timeline.progress(100);
        } else {
          duration = 0.5;
          _this._enableAnimation(duration);
          timeline.progress(0);
        }
        return setTimeout(function() {
          _this._disableAnimation();
          if (isRun) {
            return _this._makePageCurrent(page);
          }
        }, duration * 1.1 * 1000);
      };
    })(this);
    gestureEvent.on("swiping up", (function(_this) {
      return function(dist) {
        return swiping(_this.nextTimeline, _this.next, dist);
      };
    })(this));
    gestureEvent.on("swipe up", (function(_this) {
      return function(dist, v, distTime) {
        return swiped(_this.nextTimeline, _this.next, dist, v, distTime);
      };
    })(this));
    gestureEvent.on("swiping down", (function(_this) {
      return function(dist) {
        return swiping(_this.prevTimeline, _this.prev, dist);
      };
    })(this));
    return gestureEvent.on("swipe down", (function(_this) {
      return function(dist, v, distTime) {
        return swiped(_this.prevTimeline, _this.prev, dist, v, distTime);
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

  FancySlide.prototype._enableAnimation = function(duration) {
    var css;
    this.isAnimating = true;
    css = "all " + duration + "s ease-out";
    if (this.curr) {
      this.curr.$container[0].style.webkitTransition = css;
    }
    if (this.prev) {
      this.prev.$container[0].style.webkitTransition = css;
    }
    if (this.next) {
      return this.next.$container[0].style.webkitTransition = css;
    }
  };

  FancySlide.prototype._disableAnimation = function() {
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

  return FancySlide;

})(LA.SlideController);

LA.util.exports(FancySlide);

module.exports = FancySlide;



},{"./gesture-event.coffee":5}],5:[function(require,module,exports){
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



},{}],6:[function(require,module,exports){
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



},{"./loading.html":7}],7:[function(require,module,exports){
module.exports = "<div class=\"inner-content loading\">\r\n    <div class=\"padding\">{{text}}</div>\r\n</div>";

},{}],8:[function(require,module,exports){
var IntroducePage, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

tpl = require("./introduce.html");

IntroducePage = (function(_super) {
  __extends(IntroducePage, _super);

  function IntroducePage(data) {
    this.tpl = tpl;
    this.data = data || {};
    this.tl = new TimelineLite;
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
    return TweenLite.set(this.$padding, {
      "x": -300,
      "autoAlpha": 0
    });
  };

  return IntroducePage;

})(LA.PageController);

LA.util.exports(IntroducePage);

module.exports = IntroducePage;



},{"./introduce.html":9}],9:[function(require,module,exports){
module.exports = "<div class=\"inner-content introduce\">\r\n    <div class=\"padding vertical\">\r\n        {{title}}{{name}}\r\n    </div>\r\n</div>";

},{}]},{},[3]);