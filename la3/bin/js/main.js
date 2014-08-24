(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LoadingController, toBeImplemented,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toBeImplemented = require("../util.coffee").toBeImplemented;

LoadingController = (function(_super) {
  __extends(LoadingController, _super);

  function LoadingController() {
    this.$dom = null;
  }

  LoadingController.prototype.dismiss = function(callback) {
    return toBeImplemented();
  };

  LoadingController.prototype.render = function() {
    this.compileFunc = template.compile(this.tpl);
    return this.$dom = $(this.compileFunc(this.data));
  };

  return LoadingController;

})(EventEmitter2);

module.exports = LoadingController;



},{"../util.coffee":6}],2:[function(require,module,exports){
var PageController, toBeImplemented,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toBeImplemented = require("../util.coffee").toBeImplemented;

PageController = (function(_super) {
  __extends(PageController, _super);

  function PageController() {
    this.$dom = null;
  }

  PageController.prototype.start = function() {
    return toBeImplemented();
  };

  PageController.prototype.stop = function() {
    return toBeImplemented();
  };

  PageController.prototype.render = function() {
    this.compileFunc = template.compile(this.tpl);
    return this.$dom = $(this.compileFunc(this.data));
  };

  return PageController;

})(EventEmitter2);

module.exports = PageController;



},{"../util.coffee":6}],3:[function(require,module,exports){
var SlideController, toBeImplemented,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

toBeImplemented = require("../util.coffee").toBeImplemented;

SlideController = (function(_super) {
  __extends(SlideController, _super);

  function SlideController() {
    this.$dom = null;
  }

  SlideController.prototype.init = function(pages) {
    return toBeImplemented();
  };

  SlideController.prototype.enable = function() {
    return toBeImplemented();
  };

  SlideController.prototype.disable = function() {
    return toBeImplemented();
  };

  return SlideController;

})(EventEmitter2);

module.exports = SlideController;



},{"../util.coffee":6}],4:[function(require,module,exports){
var $, Core, log, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ref = require("./util.coffee"), $ = _ref.$, log = _ref.log;

Core = (function(_super) {
  __extends(Core, _super);

  function Core() {
    this.cid = 0;
    this.slide = null;
    this.loading = null;
    this.cover = null;
    this.pages = [];
    this._dismissLoadingAfterLoaded();
  }

  Core.prototype.setLoading = function(loading) {
    var $loading;
    this.loading = loading;
    $loading = $("section.loading");
    $loading.html(loading.$dom);
    return $loading.show();
  };

  Core.prototype.setCover = function(cover) {
    var $cover;
    this.cover = cover;
    $cover = $("section.cover");
    $cover.html(cover.$dom);
    $cover.show();
    return this.cover.on("done", (function(_this) {
      return function() {
        $cover.hide();
        _this.emit("cover done");
        if (_this.slide) {
          return _this.slide.enable();
        }
      };
    })(this));
  };

  Core.prototype.setSlide = function(slide) {
    this.slide = slide;
    slide.on("active", (function(_this) {
      return function(page) {
        page.start();
        return _this.emit("active page", page);
      };
    })(this));
    slide.on("deactive", (function(_this) {
      return function(page) {
        page.stop();
        return _this.emit("deactive page", page);
      };
    })(this));
    return slide.init(this.pages);
  };

  Core.prototype.addPage = function(page, pos) {
    var cid;
    cid = page.id = this._getCid();
    this._listenLock(page);
    if (pos) {
      this.pages.splice(pos, 0, page);
      page.$container = this._addPageDom(page.$dom, cid, pos);
    } else {
      this.pages.push(page);
      page.$container = this._addPageDom(page.$dom, cid);
    }
    return cid;
  };

  Core.prototype.removePage = function(cid) {
    var i, page, _i, _len, _ref1;
    _ref1 = this.pages;
    for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
      page = _ref1[i];
      if (page.id === cid) {
        this.pages.splice(i, 1);
        break;
      }
    }
    return $("#content-" + cid).remove();
  };

  Core.prototype._addPageDom = function($dom, cid, pos) {
    var $container, $newPage, $pages;
    $newPage = $("<section class='page content'></section>");
    $newPage.html($dom);
    $container = $("div.pages");
    $pages = $("section.content");
    $newPage.attr("id", "content-" + cid);
    $container[0].insertBefore($newPage[0], $pages[pos]);
    return $newPage;
  };

  Core.prototype._dismissLoadingAfterLoaded = function() {
    return $(window).on("load", (function(_this) {
      return function() {
        if (!_this.loading) {
          if (_this.cover) {
            _this.cover.start();
          }
          return;
        }
        return _this.loading.dismiss(function() {
          $("section.loading").hide();
          if (_this.cover) {
            return _this.cover.start();
          }
        });
      };
    })(this));
  };

  Core.prototype._getCid = function() {
    return this.cid++;
  };

  Core.prototype._listenLock = function(page) {
    page.on("lock", (function(_this) {
      return function() {
        return _this.slide.disable();
      };
    })(this));
    return page.on("unlock", (function(_this) {
      return function() {
        return _this.slide.enable();
      };
    })(this));
  };

  return Core;

})(EventEmitter2);

module.exports = new Core;



},{"./util.coffee":6}],5:[function(require,module,exports){
var LA, LoadingController, PageController, SlideController, core, util;

core = require("./core.coffee");

PageController = require("./controllers/page-controller.coffee");

SlideController = require("./controllers/slide-controller.coffee");

LoadingController = require("./controllers/loading-controller.coffee");

util = require("./util.coffee");

LA = window.LA = {
  core: core,
  PageController: PageController,
  util: util,
  SlideController: SlideController,
  LoadingController: LoadingController
};



},{"./controllers/loading-controller.coffee":1,"./controllers/page-controller.coffee":2,"./controllers/slide-controller.coffee":3,"./core.coffee":4,"./util.coffee":6}],6:[function(require,module,exports){
var $, log, toBeImplemented;

log = function() {
  return console.log.apply(console, arguments);
};

toBeImplemented = function() {
  throw "ERROR: Should Be Implemented!";
};

$ = window.$ = $$;

module.exports = {
  $: $,
  log: log,
  toBeImplemented: toBeImplemented
};



},{}]},{},[5]);