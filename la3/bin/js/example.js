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

module.exports = Cover;



},{"./cover.html":2}],2:[function(require,module,exports){
module.exports = "<div class=\"inner-content inner-cover\">\r\n    <div class=\"padding\">\r\n        {{title}}\r\n    </div> \r\n</div>";

},{}],3:[function(require,module,exports){
var $, Cover, EndPage, IntroducePage, Loading, Slide, TextPage, core, log, run, _ref;

Slide = require("./slide/slide.coffee");

Loading = require("./loading/loading.coffee");

Cover = require("./cover/cover.coffee");

IntroducePage = require("./pages/introduce/introduce.coffee");

TextPage = require("./pages/text/text.coffee");

EndPage = require("./pages/end/end.coffee");

_ref = LA.util, $ = _ref.$, log = _ref.log;

core = LA.core;

run = function() {
  var cover, loading, slide;
  loading = new Loading;
  core.setLoading(loading);
  cover = new Cover;
  core.setCover(cover);
  core.addPage(new IntroducePage);
  core.addPage(new TextPage);
  core.addPage(new EndPage);
  slide = new Slide;
  core.setSlide(slide);
  return slide.enable();
};

run();



},{"./cover/cover.coffee":1,"./loading/loading.coffee":4,"./pages/end/end.coffee":6,"./pages/introduce/introduce.coffee":8,"./pages/text/text.coffee":10,"./slide/slide.coffee":12}],4:[function(require,module,exports){
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

  Loading.prototype.dismiss = function(callback) {
    return setTimeout((function(_this) {
      return function() {
        return TweenLite.to(_this.$dom, 0.5, {
          "opacity": 0,
          onComplete: callback
        });
      };
    })(this), 1000);
  };

  return Loading;

})(LA.LoadingController);

module.exports = Loading;



},{"./loading.html":5}],5:[function(require,module,exports){
module.exports = "<div class=\"inner-content loading\">\r\n    <div class=\"padding\">{{text}}</div>\r\n</div>";

},{}],6:[function(require,module,exports){
var endPage, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

tpl = require("./end.html");

endPage = (function(_super) {
  __extends(endPage, _super);

  function endPage() {
    this.tpl = tpl;
    this.data = {};
    this.render();
    this.$padding = this.$dom.find("div.padding");
    this._reset();
  }

  endPage.prototype.start = function() {
    return TweenMax.to(this.$padding, 1, {
      x: 0,
      autoAlpha: 1,
      ease: Elastic.easeInOut
    });
  };

  endPage.prototype.stop = function() {
    return this._reset();
  };

  endPage.prototype._reset = function() {
    return TweenMax.set(this.$padding, {
      x: 100,
      autoAlpha: 0
    });
  };

  return endPage;

})(LA.PageController);

module.exports = endPage;



},{"./end.html":7}],7:[function(require,module,exports){
module.exports = "<div class=\"inner-content end\">\r\n    <div class=\"padding vertical\">\r\n        Our Happy Ending.\r\n    </div>\r\n</div>";

},{}],8:[function(require,module,exports){
var IntroducePage, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

tpl = require("./introduce.html");

IntroducePage = (function(_super) {
  __extends(IntroducePage, _super);

  function IntroducePage() {
    this.tpl = tpl;
    this.data = {};
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

module.exports = IntroducePage;



},{"./introduce.html":9}],9:[function(require,module,exports){
module.exports = "<div class=\"inner-content introduce\">\r\n    <div class=\"padding vertical\">\r\n        This is something I don't want to talk about.\r\n    </div>\r\n</div>";

},{}],10:[function(require,module,exports){
var textPage, tpl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

tpl = require("./text.html");

textPage = (function(_super) {
  __extends(textPage, _super);

  function textPage() {
    this.tpl = tpl;
    this.data = {};
    this.render();
    this.$padding = this.$dom.find("div.padding");
    this._reset();
  }

  textPage.prototype.start = function() {
    return TweenMax.staggerTo(this.$padding, 1.5, {
      rotation: 0,
      scale: 1,
      autoAlpha: 1,
      ease: Elastic.easeInOut
    });
  };

  textPage.prototype.stop = function() {
    return this._reset();
  };

  textPage.prototype._reset = function() {
    return TweenMax.set(this.$padding, {
      rotation: -180,
      scale: 0,
      autoAlpha: 0
    });
  };

  return textPage;

})(LA.PageController);

module.exports = textPage;



},{"./text.html":11}],11:[function(require,module,exports){
module.exports = "<div class=\"inner-content text\">\r\n    <div class=\"padding vertical\">\r\n        Ultra high-performance, professional-grade animation for the modern web\r\n    </div>\r\n</div>";

},{}],12:[function(require,module,exports){
var $, $window, CONTENT_HEIGHT, CONTENT_WIDTH, DURATION, MAX_Z_INDEX, Slide, currentIndex, dist, endY, log, nextIndex, prevIndex, startY, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ref = LA.util, $ = _ref.$, log = _ref.log;

MAX_Z_INDEX = 1000;

CONTENT_HEIGHT = window.innerHeight;

CONTENT_WIDTH = window.innerWidth;

$window = $(window);

startY = 0;

endY = 0;

dist = 0;

DURATION = 0.5;

currentIndex = 0;

prevIndex = 0;

nextIndex = 0;

Slide = (function(_super) {
  __extends(Slide, _super);

  function Slide() {
    this.curr = null;
    this.prev = null;
    this.next = null;
    this.able = false;
    this.isSwitching = false;
    this.isReachEnd = false;
    this.isFirstSetCurr = true;
  }

  Slide.prototype.init = function(pages) {
    this.pages = pages;
    pages.forEach(function(page, i) {
      return page.$container.css("zIndex", MAX_Z_INDEX - i);
    });
    currentIndex = 0;
    nextIndex = 1;
    prevIndex = -1;
    this._update();
    return this._initEvents();
  };

  Slide.prototype.enable = function() {
    return this.able = true;
  };

  Slide.prototype.disable = function() {
    return this.able = false;
  };

  Slide.prototype._initEvents = function() {
    $window.on("touchstart", (function(_this) {
      return function(event) {
        return startY = event.touches[0].clientY;
      };
    })(this));
    $window.on("touchmove", (function(_this) {
      return function(event) {
        endY = event.touches[0].clientY;
        dist = endY - startY;
        if (currentIndex === 0) {
          if (dist > 0 && !_this.isReachEnd) {
            return;
          }
        }
        if (_this.able && !_this.isSwitching) {
          return _this._slide();
        }
      };
    })(this));
    return $window.on("touchend", (function(_this) {
      return function() {
        if (_this.able) {
          if (_this._isReadyToSwitch()) {
            if (dist < 0) {
              return _this._switchUp();
            } else {
              if (currentIndex === 0 && !_this.isReachEnd) {
                return;
              }
              return _this._switchDown();
            }
          } else {
            return _this._back();
          }
        }
      };
    })(this));
  };

  Slide.prototype._slide = function() {
    if (dist < 0) {
      TweenMax.set(this.currPage.$container, {
        "y": dist
      });
      TweenMax.set(this.nextPage.$container, {
        "y": CONTENT_HEIGHT + dist
      });
    }
    if (dist > 0) {
      if (!this.prevPage) {
        return;
      }
      TweenMax.set(this.currPage.$container, {
        "y": dist
      });
      return TweenMax.set(this.prevPage.$container, {
        "y": -CONTENT_HEIGHT + dist
      });
    }
  };

  Slide.prototype._switchUp = function() {
    var check, count;
    this.isSwitching = true;
    count = 0;
    check = (function(_this) {
      return function() {
        if (++count === 2) {
          _this.emit("deactive", _this.currPage);
          _this._next();
          return _this.isSwitching = false;
        }
      };
    })(this);
    TweenMax.to(this.currPage.$container, DURATION, {
      "y": -CONTENT_HEIGHT,
      onComplete: check
    });
    return TweenMax.to(this.nextPage.$container, DURATION, {
      "y": 0,
      onComplete: check
    });
  };

  Slide.prototype._switchDown = function() {
    var check, count;
    this.isSwitching = true;
    count = 0;
    check = (function(_this) {
      return function() {
        if (++count === 2) {
          _this.emit("deactive", _this.currPage);
          _this._prev();
          return _this.isSwitching = false;
        }
      };
    })(this);
    TweenMax.to(this.currPage.$container, DURATION, {
      "y": CONTENT_HEIGHT,
      onComplete: check
    });
    return TweenMax.to(this.prevPage.$container, DURATION, {
      "y": 0,
      onComplete: check
    });
  };

  Slide.prototype._setNext = function(page) {
    if (!page) {
      return;
    }
    this.nextPage = page;
    return TweenMax.set(page.$container, {
      "y": CONTENT_HEIGHT
    });
  };

  Slide.prototype._setCurr = function(page) {
    var active;
    if (!page) {
      return;
    }
    this.currPage = page;
    TweenMax.set(page.$container, {
      "y": 0
    });
    active = (function(_this) {
      return function() {
        return _this.emit("active", page);
      };
    })(this);
    if (this.isFirstSetCurr) {
      this.isFirstSetCurr = false;
      LA.core.on("cover done", active);
      return;
    }
    return active();
  };

  Slide.prototype._setPrev = function(page) {
    if (!page) {
      return;
    }
    this.prevPage = page;
    return TweenMax.set(page.$container, {
      "y": -CONTENT_HEIGHT
    });
  };

  Slide.prototype._isReadyToSwitch = function() {
    return Math.abs(dist) > 50;
  };

  Slide.prototype._back = function() {
    var time;
    time = 0.3;
    if (this.currPage) {
      TweenMax.to(this.currPage.$container, time, {
        "y": 0
      });
    }
    if (this.prevPage) {
      TweenMax.to(this.prevPage.$container, time, {
        "y": -CONTENT_HEIGHT
      });
    }
    if (this.nextPage) {
      return TweenMax.to(this.nextPage.$container, time, {
        "y": CONTENT_HEIGHT
      });
    }
  };

  Slide.prototype._next = function() {
    prevIndex = currentIndex;
    currentIndex = nextIndex;
    nextIndex = currentIndex + 1 === this.pages.length ? 0 : currentIndex + 1;
    return this._update();
  };

  Slide.prototype._prev = function() {
    nextIndex = currentIndex;
    currentIndex = prevIndex;
    prevIndex = currentIndex - 1 === -1 ? this.pages.length - 1 : currentIndex - 1;
    return this._update();
  };

  Slide.prototype._update = function() {
    MAX_Z_INDEX += 4;
    this._setCurr(this.pages[currentIndex]);
    this._setPrev(this.pages[prevIndex]);
    this._setNext(this.pages[nextIndex]);
    if (currentIndex === this.pages.length - 1) {
      this.isReachEnd = true;
    }
    if (this.prevPage) {
      this.prevPage.$container.css("zIndex", MAX_Z_INDEX - 2);
    }
    if (this.currPage) {
      this.currPage.$container.css("zIndex", MAX_Z_INDEX - 1);
    }
    if (this.nextPage) {
      return this.nextPage.$container.css("zIndex", MAX_Z_INDEX);
    }
  };

  return Slide;

})(LA.SlideController);

module.exports = Slide;



},{}]},{},[3]);