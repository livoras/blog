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
var EasySlide, GAP, HEIGHT, WIDTH, css, gestureEvent, setY,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

gestureEvent = require("./gesture-event.coffee");

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
  $dom[0].style.webkitTransform = "translate3d(0, " + y + "px, 0)";
  return $dom.y = y;
};

EasySlide = (function(_super) {
  __extends(EasySlide, _super);

  function EasySlide() {
    this.$progress = $("<ul id='slide-progress'></ul>");
    this.$pages = $("div.pages");
    this.$pages.css("width", "" + WIDTH + "px");
    $("div.wrapper").append(this.$progress);
    this.currentIndex = 0;
    this.able = false;
    this.isLoop = true;
    this.isReachEnd = false;
    this.isFirstSetCurr = true;
    this.isProgressShow = true;
    this.duration = 1;
    this.isAnimating = false;
    this.isFast = false;
  }

  EasySlide.prototype.init = function(pages) {
    this.pages = pages;
    this.pages.forEach((function(_this) {
      return function(page, i) {
        page.$container.css("height", "" + HEIGHT + "px");
        page.$container.css("width", "" + WIDTH + "px");
        page.pageIndex = i;
        return _this.$progress.append($("<li id='progress-" + i + "'></li>"));
      };
    })(this));
    this._setPosByIndex(0);
    this._activeProgressByIndex(this.currentIndex);
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

  EasySlide.prototype._initEvents = function() {
    gestureEvent.on("swiping up", (function(_this) {
      return function(dist) {
        if (!_this.able || _this.isAnimating) {
          return;
        }
        if (_this.currentIndex === _this.pages.length - 1) {
          if (dist > GAP) {
            dist = GAP;
          }
        }
        return setY(_this.$pages, -_this.currentIndex * HEIGHT - dist);
      };
    })(this));
    gestureEvent.on("swipe up", (function(_this) {
      return function(dist, v, distTime) {
        var currentProgress, duration, isRun;
        if (!_this.able || _this.isAnimating) {
          return;
        }
        isRun = false;
        currentProgress = dist / HEIGHT;
        if (_this.currentIndex !== _this.pages.length - 1 && (dist > GAP || v > 1)) {
          _this.previousIndex = _this.currentIndex;
          _this.currentIndex++;
          isRun = true;
          duration = (1 - currentProgress) * _this.duration;
          if (_this.isFast && v > 2) {
            duration = 0.15;
          }
        } else {
          duration = 0.5;
        }
        _this._enableAnimation(duration);
        _this._setPosByIndex(_this.currentIndex);
        return setTimeout(function() {
          _this._disableAnimation();
          if (isRun) {
            return _this._triggerActive();
          }
        }, duration * 1.1 * 1000);
      };
    })(this));
    gestureEvent.on("swiping down", (function(_this) {
      return function(dist) {
        if (!_this.able || _this.isAnimating) {
          return;
        }
        if (_this.currentIndex === 0) {
          if (dist > GAP) {
            dist = GAP;
          }
        }
        return setY(_this.$pages, -_this.currentIndex * HEIGHT + dist);
      };
    })(this));
    return gestureEvent.on("swipe down", (function(_this) {
      return function(dist, v, distTime) {
        var currentProgress, duration, isRun;
        if (!_this.able || _this.isAnimating) {
          return;
        }
        isRun = false;
        currentProgress = dist / HEIGHT;
        if (_this.currentIndex !== 0 && (dist > GAP || v > 1)) {
          _this.previousIndex = _this.currentIndex;
          _this.currentIndex--;
          isRun = true;
          duration = (1 - currentProgress) * _this.duration;
          if (_this.isFast && v > 2) {
            duration = 0.15;
          }
        } else {
          duration = 0.5;
        }
        _this._enableAnimation(duration);
        _this._setPosByIndex(_this.currentIndex);
        return setTimeout(function() {
          _this._disableAnimation();
          if (isRun) {
            return _this._triggerActive();
          }
        }, duration * 1.1 * 1000);
      };
    })(this));
  };

  EasySlide.prototype._triggerActive = function() {
    this._activeProgressByIndex(this.currentIndex);
    if (typeof this.previousIndex === "number") {
      this.emit("deactive", this.pages[this.previousIndex]);
    }
    if (typeof this.currentIndex === "number") {
      return this.emit("active", this.pages[this.currentIndex]);
    }
  };

  EasySlide.prototype._setPosByIndex = function(index) {
    return setY(this.$pages, -index * HEIGHT);
  };

  EasySlide.prototype._activeProgressByIndex = function(index) {
    $("#slide-progress li.active").removeClass("active");
    return $("#progress-" + index).addClass("active");
  };

  EasySlide.prototype._enableAnimation = function(duration) {
    var cssStr;
    this.isAnimating = true;
    cssStr = "all " + duration + "s ease-out";
    return this.$pages[0].style.webkitTransition = cssStr;
  };

  EasySlide.prototype._disableAnimation = function() {
    this.isAnimating = false;
    return this.$pages[0].style.webkitTransition = "";
  };

  return EasySlide;

})(LA.SlideController);

LA.util.exports(EasySlide);

module.exports = EasySlide;



},{"./gesture-event.coffee":4}],4:[function(require,module,exports){
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



},{}],5:[function(require,module,exports){
var $, Cover, HEIGHT, IntroducePage, Loading, Slide, core, log, pages, run, _ref;

_ref = LA.util, $ = _ref.$, log = _ref.log;

Loading = require("./loading/loading.coffee");

Cover = require("./cover/cover.coffee");

Slide = require("./easy-slide/easy-slide.coffee");

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
  var pageData, slide, _i, _len;
  $("body").css("backgroundColor", "#555");
  for (_i = 0, _len = pages.length; _i < _len; _i++) {
    pageData = pages[_i];
    core.addPage(new IntroducePage(pageData));
  }
  slide = new Slide;
  slide.setDuration(1);
  slide.fast();
  core.setSlide(slide);
  return core.start();
};

run();



},{"./cover/cover.coffee":1,"./easy-slide/easy-slide.coffee":3,"./loading/loading.coffee":6,"./pages/introduce/introduce.coffee":8}],6:[function(require,module,exports){
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
    this.render();
    this.stop();
  }

  IntroducePage.prototype.start = function() {};

  IntroducePage.prototype.stop = function() {
    return this._reset();
  };

  IntroducePage.prototype._reset = function() {};

  return IntroducePage;

})(LA.PageController);

LA.util.exports(IntroducePage);

module.exports = IntroducePage;



},{"./introduce.html":9}],9:[function(require,module,exports){
module.exports = "<div class=\"inner-content introduce\">\r\n    <div class=\"padding vertical\">\r\n        {{title}}{{name}}\r\n    </div>\r\n</div>";

},{}]},{},[5]);