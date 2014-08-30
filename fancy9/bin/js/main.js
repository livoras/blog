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

  function PageController(data) {
    this.data = data;
    this.$dom = null;
  }

  PageController.prototype.start = function() {
    return toBeImplemented();
  };

  PageController.prototype.stop = function() {
    return toBeImplemented();
  };

  PageController.prototype.setBackground = function(url) {
    return this.$dom.css("backgroundImage", "url(" + url + ")");
  };

  PageController.prototype.render = function() {
    this.compileFunc = template.compile(this.tpl);
    this.$dom = $(this.compileFunc(this.data));
    if (this.data.bg) {
      return this.setBackground(this.data.bg);
    }
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
var $, Core, log, wrapper, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ref = require("./util.coffee"), $ = _ref.$, log = _ref.log;

wrapper = require("../tpl/wrapper.html");

$("body").prepend($(wrapper));

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
        return _this._enaleSlideForTheFirstTime();
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
    this.emit("add page", page, pos);
    return cid;
  };

  Core.prototype.removePage = function(cid) {
    var i, page, _i, _len, _ref1;
    _ref1 = this.pages;
    for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
      page = _ref1[i];
      if (page.id === cid) {
        this.pages.splice(i, 1);
        this.emit("remove page", page, i);
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
    var checkAndStart;
    checkAndStart = (function(_this) {
      return function() {
        if (_this.cover) {
          return _this.cover.start();
        } else {
          return _this._enaleSlideForTheFirstTime();
        }
      };
    })(this);
    return $(window).on("load", (function(_this) {
      return function() {
        if (!_this.loading) {
          return checkAndStart();
        }
        _this.loading.on("dismissed", function() {
          $("section.loading").hide();
          return checkAndStart();
        });
        return _this.loading.dismiss();
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

  Core.prototype._enaleSlideForTheFirstTime = function() {
    var currentPage;
    if (this.slide) {
      this.slide.enable();
    }
    currentPage = this.pages[0];
    if (currentPage) {
      return currentPage.start();
    }
  };

  return Core;

})(EventEmitter2);

module.exports = new Core;



},{"../tpl/wrapper.html":7,"./util.coffee":6}],5:[function(require,module,exports){
var LA, LoadingController, PageController, SlideController, config, core, get, modules, set, util;

core = require("./core.coffee");

PageController = require("./controllers/page-controller.coffee");

SlideController = require("./controllers/slide-controller.coffee");

LoadingController = require("./controllers/loading-controller.coffee");

util = require("./util.coffee");

modules = {};

config = {};

set = function(key, value) {
  return config[key] = value;
};

get = function(key) {
  return config[key];
};

LA = window.LA = {
  core: core,
  PageController: PageController,
  util: util,
  modules: modules,
  SlideController: SlideController,
  LoadingController: LoadingController,
  get: get,
  set: set
};



},{"./controllers/loading-controller.coffee":1,"./controllers/page-controller.coffee":2,"./controllers/slide-controller.coffee":3,"./core.coffee":4,"./util.coffee":6}],6:[function(require,module,exports){
var $, exports, getCurrentDataId, getCurrentScript, injectStyle, log, toBeImplemented;

log = function() {
  return console.log.apply(console, arguments);
};

toBeImplemented = function() {
  throw "ERROR: Should Be Implemented!";
};

injectStyle = function(styleStr) {
  var $style;
  $style = $("<style></style>");
  $style.html(styleStr);
  return $(document.body).append($style);
};

getCurrentScript = function() {
  var scripts;
  if (document.currentScript) {
    return document.currentScript;
  } else {
    scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  }
};

exports = function(module) {
  var id;
  id = getCurrentDataId();
  return LA.modules[id] = module;
};

getCurrentDataId = function() {
  var $script;
  $script = $(getCurrentScript());
  return $script.attr("data-id");
};

$ = window.$ = $$;

module.exports = {
  $: $,
  log: log,
  toBeImplemented: toBeImplemented,
  injectStyle: injectStyle,
  getCurrentScript: getCurrentScript,
  exports: exports
};



},{}],7:[function(require,module,exports){
module.exports = "<div class=\"wrapper\">\r\n    <section class=\"page loading\"></section>\r\n    <section class=\"page cover\"></section>\r\n    <div class=\"pages\"></div>\r\n</div>\r\n";

},{}]},{},[5]);