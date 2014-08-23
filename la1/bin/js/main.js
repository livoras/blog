(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
;!function(undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {

      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);
      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    configure.call(this, conf);
  }

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }

    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }

        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else if(typeof tree._listeners === 'function') {
          tree._listeners = [tree._listeners, listener];
        }
        else if (isArray(tree._listeners)) {

          tree._listeners.push(listener);

          if (!tree._listeners.warned) {

            var m = defaultMaxListeners;

            if (typeof this._events.maxListeners !== 'undefined') {
              m = this._events.maxListeners;
            }

            if (m > 0 && tree._listeners.length > m) {

              tree._listeners.warned = true;
              console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            tree._listeners.length);
              console.trace();
            }
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  }

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    this._events || init.call(this);
    this._events.maxListeners = n;
    if (!this._conf) this._conf = {};
    this._conf.maxListeners = n;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    }

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) { return false; }
    }

    // Loop through the *_all* functions and invoke them.
    if (this._all) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        this._all[i].apply(this, args);
      }
    }

    // If there is no 'error' event listener then throw.
    if (type === 'error') {

      if (!this._all &&
        !this._events.error &&
        !(this.wildcard && this.listenerTree.error)) {

        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    var handler;

    if(this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    }
    else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      if (arguments.length === 1) {
        handler.call(this);
      }
      else if (arguments.length > 1)
        switch (arguments.length) {
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            var l = arguments.length;
            var args = new Array(l - 1);
            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
            handler.apply(this, args);
        }
      return true;
    }
    else if (handler) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        this.event = type;
        listeners[i].apply(this, args);
      }
      return (listeners.length > 0) || !!this._all;
    }
    else {
      return !!this._all;
    }

  };

  EventEmitter.prototype.on = function(type, listener) {

    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if(this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else if(typeof this._events[type] === 'function') {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }
    else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (!this._events[type].warned) {

        var m = defaultMaxListeners;

        if (typeof this._events.maxListeners !== 'undefined') {
          m = this._events.maxListeners;
        }

        if (m > 0 && this._events[type].length > m) {

          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
          console.trace();
        }
      }
    }
    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {

    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    if(!this._all) {
      this._all = [];
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }
        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          return this;
        }
      }
    } else {
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else {
      if (!this._events[type]) return this;
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if(this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
    define(function() {
      return EventEmitter;
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    exports.EventEmitter2 = EventEmitter;
  }
  else {
    // Browser global.
    window.EventEmitter2 = EventEmitter;
  }
}();

},{}],2:[function(require,module,exports){
var $, Core, EventEmitter2, log, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ref = require("./util.coffee"), $ = _ref.$, log = _ref.log;

EventEmitter2 = (require("eventemitter2")).EventEmitter2;

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

  return Core;

})(EventEmitter2);

module.exports = new Core;



},{"./util.coffee":4,"eventemitter2":1}],3:[function(require,module,exports){
var test;

test = require("../../test/test.coffee");

test.run();



},{"../../test/test.coffee":7}],4:[function(require,module,exports){
var $, each, log;

log = function() {
  return console.log.apply(console, arguments);
};

each = function(list, callback) {
  return [].forEach.call(list, callback);
};

$ = window.$ = $$;

module.exports = {
  $: $,
  log: log,
  each: each
};



},{}],5:[function(require,module,exports){
var assert;

assert = function(msg, statement) {
  if (arguments.length === 1) {
    msg = ">>> Anonymous Test";
    statement = msg;
  }
  msg = "TEST: " + msg;
  if (statement) {
    return console.log("%c" + msg + " passed", "color: green;");
  } else {
    return console.log("%c" + msg + " failed", "color: red;");
  }
};

module.exports = assert;



},{}],6:[function(require,module,exports){
var $, $window, CONTENT_HEIGHT, CONTENT_WIDTH, DURATION, EventEmitter2, MAX_Z_INDEX, Slide, currentIndex, dist, endY, log, nextIndex, prevIndex, startY, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter2 = (require("eventemitter2")).EventEmitter2;

_ref = require("../src/js/util.coffee"), $ = _ref.$, log = _ref.log;

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
        if (currentIndex === 0 && !_this.isReachEnd) {
          return;
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
    this.emit("deactive", this.currPage);
    count = 0;
    check = (function(_this) {
      return function() {
        if (++count === 2) {
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
    this.emit("deactive", this.currPage);
    count = 0;
    check = (function(_this) {
      return function() {
        if (++count === 2) {
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
    if (!page) {
      return;
    }
    this.currPage = page;
    TweenMax.set(page.$container, {
      "y": 0
    });
    return this.emit("active", page);
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

})(EventEmitter2);

module.exports = Slide;



},{"../src/js/util.coffee":4,"eventemitter2":1}],7:[function(require,module,exports){
var $, Cover, EventEmitter2, Loading, Page, Slide, assert, colors, core, log, previous, processDom, run, util,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter2 = (require("eventemitter2")).EventEmitter2;

core = require("../src/js/core.coffee");

util = require("../src/js/util.coffee");

assert = require("./assert.coffee");

Slide = require("./slide-effect.coffee");

$ = util.$, log = util.log;

Page = (function(_super) {
  __extends(Page, _super);

  function Page(id) {
    this.$dom = $("<div><div>FUCK" + id + "</div></div>");
    processDom(this.$dom);
  }

  Page.prototype.start = function() {
    return log("start");
  };

  Page.prototype.stop = function() {
    return log("stop");
  };

  return Page;

})(EventEmitter2);

Loading = (function(_super) {
  __extends(Loading, _super);

  function Loading() {
    this.$dom = $("<div><div>My Loading...</div></div>");
    processDom(this.$dom);
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

})(EventEmitter2);

Cover = (function(_super) {
  __extends(Cover, _super);

  function Cover() {
    this.$dom = $("<div><div>Fucking Cover..</div></div>");
    processDom(this.$dom);
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
          onComplete: function() {
            return _this.emit("done");
          }
        });
      };
    })(this));
  };

  return Cover;

})(EventEmitter2);

colors = ["#319574", "#b54322", "#484d79", "#c59820"];

previous = 0;

processDom = function($dom) {
  var now;
  now = Math.floor(Math.random() * colors.length);
  while (now === previous) {
    now = Math.floor(Math.random() * colors.length);
  }
  previous = now;
  $dom.css("width", "100%");
  $dom.css("height", "100%");
  $dom.css("backgroundColor", colors[now]);
  $dom.css("color", "#ccc");
  return $dom.find("div").css("padding", "10px");
};

run = function() {
  var cover, fakePage, i, loading, slide, _i;
  cover = new Cover;
  core.setCover(cover);
  loading = new Loading;
  core.setLoading(loading);
  for (i = _i = 1; _i <= 4; i = ++_i) {
    fakePage = new Page(i);
    core.addPage(fakePage);
  }
  fakePage = new Page('page 1');
  core.addPage(fakePage, 2);
  core.removePage(fakePage.id);
  slide = new Slide;
  return core.setSlide(slide);
};

exports.run = run;



},{"../src/js/core.coffee":2,"../src/js/util.coffee":4,"./assert.coffee":5,"./slide-effect.coffee":6,"eventemitter2":1}]},{},[3]);