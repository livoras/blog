(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var util = require("./util")
var EventEmitter = require("eventemitter2").EventEmitter2

EventEmitter.extend = util.extend

module.exports = EventEmitter

},{"./util":5,"eventemitter2":6}],2:[function(require,module,exports){
require("./init")

var Event = require("./event")

var Game = function() {
    this.isStart = false
    this.isStop = true
    this.isResume = false
    this.isPause = true
    this.sprits = [] 
    this.timer = null
}

var gameMethods = {
    init: function() {
        this.emit("init")
        this.render()
    },
    start: function() {
        this.isStart = true
        this.isStop = true
        this.resume()
        this.emit("start")
    },
    stop: function() {
        this.isStart = false
        this.isStop = true
        this.pause()
        this.emit("stop")
    },
    pause: function() {
        this.isPause = true
        this.isResume = false
        this.emit("pause")
    },
    resume: function() {
        this.isResume = true
        this.isPause = false
        this.emit("resume")
    },
    render: function() {
        var rate = 1000 / 60
        var that = this
        function _run() {
            var sprits = that.sprits
            that.sprits = []
            for (var i = 0, len = sprits.length; i < len; i++) {
                var sprit = sprits[i]
                if (!sprit.isToRemove) {
                    var sprit = sprits[i]
                    that.sprits.push(sprit)
                    sprit.move()
                } else {
                    that.emit("sprit removed", sprit)
                    if (typeof sprit._after_remove === "function") {
                        sprit._after_remove();
                        delete sprit._after_remove
                    }
                }
            }
            that.timer = requestAnimationFrame(_run)
        }
        _run()
    },
    add: function(sprit) {
        if (!(typeof sprit.move === 'function')) {
            throw "Sprit should have a `move` function."
        }
        sprit.isToRemove = false
        this.sprits.push(sprit)
        this.emit("sprit added", sprit)
    },
    remove: function(sprit, callback) {
        sprit.isToRemove = true
        sprit._after_remove= callback
    }
}

module.exports = Event.extend(Game, gameMethods)

},{"./event":1,"./init":3}],3:[function(require,module,exports){
// From http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
// By @PaulIrish, thx god!
var lastTime = 0;
var vendors = ['webkit', 'moz'];

for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

},{}],4:[function(require,module,exports){
// Resources loader and manager
var Event = require("./event")

var r = new Event

r.images = {
    pool: {},
    count: 0,
    loadedCount: 0
}

r.images.set = function(id, src, callback) {
    var img = new Image
    if (r.images.pool[id]) {
        throw new Error("id " + id + " existed.")
    }
    img.addEventListener("load", function() {
        img.isLoaded = true
        if (typeof callback === "function") {
            callback(img)
            r.emit("image loaded", img)
        }

        r.images.loadedCount++
        if (r.images.loadedCount === r.images.count) {
            r.emit("all images loaded")
        }
    })
    img.src = src
    r.images.pool[id] = img
    r.images.count++
    return img
}

r.images.get = function(id) {
    return r.images.pool[id]
}

module.exports = r

},{"./event":1}],5:[function(require,module,exports){
function extend(Constructor, prototype) {
    var Super = this
    function Sub() { Constructor.apply(this, arguments) }
    function F() {}
    F.prototype = Super.prototype
    Sub.prototype = new F()
    for (var prop in prototype) {
        Sub.prototype[prop] = prototype[prop]
    }
    Sub.prototype.constructor = Constructor
    Sub.name = Constructor.name
    Sub.extend = extend
    return Sub
}

function $(selector) {
    var doms = document.querySelectorAll(selector)
    if (doms.length == 1) return doms[0]
    return doms
}

var fps = (function() {
    var last = 0
    return function () {
        var cacheLast = last
        var current = last = +new Date
        return Math.floor(1000 / (current - cacheLast))
    }
})()

module.exports = {
    extend: extend,
    $: $,
    fps: fps
}

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var Bird, EventEmitter, HEIGHT, RATE, VX, VY, WIDTH, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = require("eventemitter2").EventEmitter2;

_ref = require("./common.coffee"), HEIGHT = _ref.HEIGHT, WIDTH = _ref.WIDTH, RATE = _ref.RATE;

VX = 3;

VY = 5;

Bird = (function(_super) {
  __extends(Bird, _super);

  function Bird() {
    Bird.__super__.constructor.call(this, this);
    this.x = 0;
    this.y = 0;
    this.vx = VX;
    this.vy = VY;
    this.then = null;
    this.acc = null;
    this.bird = null;
  }

  Bird.prototype.init = function(bird, bounds) {
    this.bird = bird;
    this.bounds = bounds;
    this.bird.width = 50;
    this.bird.height = 32;
    this.bird.style.border = "1px solid #ddd";
    this.reset();
    return this.draw();
  };

  Bird.prototype.reset = function() {
    this.isDie = true;
    this.x = (WIDTH - this.bird.width) / 2;
    this.y = HEIGHT / 2 - this.bird.height;
    this.vx = 0;
    return this.vy = 0;
  };

  Bird.prototype.revive = function() {
    this.isDie = false;
    this.vx = VX;
    return this.vy = -VY;
  };

  Bird.prototype.move = function() {
    var now, passed;
    if (!this.then) {
      this.acc = 0;
      return this.then = +(new Date);
    }
    now = +(new Date);
    passed = now - this.then;
    this.acc += passed;
    while (this.acc > RATE) {
      this.update();
      this.acc -= RATE;
    }
    this.then = now;
    return this.draw();
  };

  Bird.prototype.update = function() {
    this.updateX();
    return this.updateY();
  };

  Bird.prototype.updateX = function() {
    if ((this.x > WIDTH - this.bird.width) || (this.x < 0)) {
      if (this.x < 0) {
        this.x = 0;
      } else {
        this.x = WIDTH - this.bird.width;
      }
      this.vx = -this.vx;
      this.emit("turn around");
    }
    return this.x += this.vx;
  };

  Bird.prototype.updateY = function() {
    if (this.isDie) {
      return;
    }
    if ((this.y <= this.bounds.up) || (this.y >= this.bounds.down - this.bird.height)) {
      this.y = this.bounds.down - this.bird.height;
      this.die();
    } else {
      this.vy += 0.2;
    }
    return this.y += this.vy;
  };

  Bird.prototype.draw = function() {
    return this.bird.style.webkitTransform = "translate3d(" + this.x + "px, " + this.y + "px, 0)";
  };

  Bird.prototype.flip = function() {
    this.vy = -VY;
    if (this.isDie) {
      return this.reset();
    }
  };

  Bird.prototype.die = function() {
    this.vy = 0;
    this.vx = 0;
    this.isDie = true;
    return this.emit("die");
  };

  return Bird;

})(EventEmitter);

module.exports = new Bird;



},{"./common.coffee":9,"eventemitter2":6}],8:[function(require,module,exports){
var $, BRICK_HEIGHT, Bricks, EventEmitter, HEIGHT, PENALTY, WIDTH, createBrick, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = require("../../lib/util").$;

EventEmitter = require("eventemitter2").EventEmitter2;

_ref = require("./common.coffee"), WIDTH = _ref.WIDTH, HEIGHT = _ref.HEIGHT;

PENALTY = 0.8;

BRICK_HEIGHT = 20;

Bricks = (function(_super) {
  __extends(Bricks, _super);

  function Bricks() {
    this.leftBrick = null;
    this.rightBrick = null;
    this.topBrick = null;
    this.bottomBrick = null;
    this.brickWidth = null;
    this.dist = null;
  }

  Bricks.prototype.init = function(width, dist) {
    this.dist = dist;
    console.log(width, dist);
    this.brickWidth = width;
    this.setGroups(dist / 2);
    this.initBricks(width);
    this.initBottomBricks();
    return this.initTopBricks();
  };

  Bricks.prototype.initBricks = function(width) {
    var COLOR, height;
    COLOR = "#76B1D8";
    height = BRICK_HEIGHT;
    this.leftBrick = createBrick("left");
    this.leftBrick.style.cssText = "border-left: " + height + "px solid " + COLOR + ";\nborder-top: " + (width / 2) + "px solid transparent;\nborder-bottom: " + (width / 2) + "px solid transparent;";
    this.rightBrick = createBrick("right");
    this.rightBrick.style.cssText = "border-right: " + height + "px solid " + COLOR + ";\nborder-top: " + (width / 2) + "px solid transparent;\nborder-bottom: " + (width / 2) + "px solid transparent;";
    this.bottomBrick = createBrick("bottom");
    this.bottomBrick.style.cssText = "border-bottom: " + height + "px solid " + COLOR + ";\nborder-right: " + (width / 2) + "px solid transparent;\nborder-left: " + (width / 2) + "px solid transparent;\ntop: " + (-height * PENALTY) + "px;";
    this.topBrick = createBrick("top");
    return this.topBrick.style.cssText = "border-top: " + height + "px solid " + COLOR + ";\nborder-right: " + (width / 2) + "px solid transparent;\nborder-left: " + (width / 2) + "px solid transparent;\nbottom: " + (-height * PENALTY) + "px;";
  };

  Bricks.prototype.setGroups = function(height) {
    $(".up-ground").style.height = "" + height + "px";
    return $(".down-ground").style.height = "" + height + "px";
  };

  Bricks.prototype.initBottomBricks = function() {
    var brick, downGround, i, _i, _ref1, _results;
    downGround = $(".down-ground");
    _results = [];
    for (i = _i = 0, _ref1 = (WIDTH / this.brickWidth) - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      brick = this.bottomBrick.cloneNode(true);
      brick.style.left = "" + (i * this.brickWidth) + "px";
      _results.push(downGround.appendChild(brick));
    }
    return _results;
  };

  Bricks.prototype.initTopBricks = function() {
    var brick, i, upGround, _i, _ref1, _results;
    upGround = $(".up-ground");
    _results = [];
    for (i = _i = 0, _ref1 = (WIDTH / this.brickWidth) - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      brick = this.topBrick.cloneNode(true);
      brick.style.left = "" + (i * this.brickWidth) + "px";
      _results.push(upGround.appendChild(brick));
    }
    return _results;
  };

  Bricks.prototype.getBounds = function() {
    var down, left, right, up;
    up = this.dist / 2 + BRICK_HEIGHT * PENALTY;
    down = HEIGHT - (this.dist / 2 + BRICK_HEIGHT * PENALTY);
    left = BRICK_HEIGHT;
    right = WIDTH - BRICK_HEIGHT;
    return {
      up: up,
      down: down,
      left: left,
      right: right
    };
  };

  return Bricks;

})(EventEmitter);

createBrick = function(type) {
  var div;
  div = document.createElement("div");
  div.className = "angle " + type;
  return div;
};

module.exports = new Bricks;



},{"../../lib/util":5,"./common.coffee":9,"eventemitter2":6}],9:[function(require,module,exports){
var AGENT, HEIGHT, MAX_HEIGHT, MAX_WIDTH, RATE, WIDTH;

HEIGHT = document.documentElement.clientHeight;

WIDTH = document.documentElement.clientWidth;

MAX_HEIGHT = 568;

MAX_WIDTH = 360;

HEIGHT = HEIGHT > MAX_HEIGHT ? MAX_HEIGHT : HEIGHT;

WIDTH = WIDTH > MAX_WIDTH ? MAX_WIDTH : WIDTH;

RATE = 16.7;

AGENT = window.navigator.userAgent;

module.exports = {
  HEIGHT: HEIGHT,
  WIDTH: WIDTH,
  RATE: RATE,
  AGENT: AGENT
};



},{}],10:[function(require,module,exports){
var $, AGENT, HEIGHT, RATE, WIDTH, agent, debug, eDebug, util, _ref;

util = require("../../lib/util");

_ref = require("./common.coffee"), HEIGHT = _ref.HEIGHT, WIDTH = _ref.WIDTH, RATE = _ref.RATE, AGENT = _ref.AGENT;

$ = util.$;

eDebug = $("#debug");

agent = AGENT.match(/AppleWebKit\/.+?\s/)[0];

debug = {
  count: 0,
  move: function() {
    var fps;
    fps = util.fps();
    if (++this.count === 10) {
      this.count = 0;
      return eDebug.innerHTML = "<p>width: " + WIDTH + ", height: " + HEIGHT + ", FPS: " + fps + "</p>\n<hr>\n<p>" + agent + "</p>";
    }
  }
};

module.exports = debug;



},{"../../lib/util":5,"./common.coffee":9}],11:[function(require,module,exports){
var $, $area, Game, HEIGHT, WIDTH, bird, bricks, debug, flipWhenTouchDown, game, initArea, initBird, initBricks, initStates, load, r, states, util, _ref;

Game = require("../../lib/game");

bird = require("./bird.coffee");

debug = require("./debug.coffee");

states = require("./states.coffee");

bricks = require("./bricks.coffee");

r = require("../../lib/r");

util = require("../../lib/util");

_ref = require("./common.coffee"), HEIGHT = _ref.HEIGHT, WIDTH = _ref.WIDTH;

$ = util.$;

game = new Game;

$area = $(".area");

game.on("init", function() {
  game.add(debug);
  initArea();
  initBricks();
  initStates();
  initBird();
  return states.change("start");
});

initArea = function() {
  $area.style.height = "" + HEIGHT + "px";
  return $area.style.width = "" + WIDTH + "px";
};

initBird = function() {
  var birdDOM;
  birdDOM = r.images.get("bird");
  birdDOM.className = "bird";
  $area.appendChild(birdDOM);
  bird.init(birdDOM, bricks.getBounds());
  flipWhenTouchDown();
  return game.add(bird);
};

initBricks = function() {
  var brickWidth, dist;
  brickWidth = 35;
  dist = HEIGHT - brickWidth * 13;
  if (dist < 0) {
    brickWidth = Math.floor(HEIGHT / 13);
    dist = 0;
  }
  return bricks.init(brickWidth, dist);
};

initStates = function() {
  states.on("start", function() {
    return bird.reset();
  });
  states.on("game", function() {
    return bird.revive();
  });
  return bird.on("die", function() {
    return states.change("over");
  });
};

flipWhenTouchDown = function() {
  return window.addEventListener("touchstart", function() {
    if (states.state === "game") {
      return bird.flip();
    }
  });
};

load = function() {
  r.on("all images loaded", function() {
    return game.init();
  });
  return r.images.set("bird", "assets/bird.png");
};

load();



},{"../../lib/game":2,"../../lib/r":4,"../../lib/util":5,"./bird.coffee":7,"./bricks.coffee":8,"./common.coffee":9,"./debug.coffee":10,"./states.coffee":12}],12:[function(require,module,exports){
var $, EventEmitter, State, states, util,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

util = require("../../lib/util");

EventEmitter = require("eventemitter2").EventEmitter2;

states = ["start", "game", "over", "share"];

$ = util.$;

State = (function(_super) {
  __extends(State, _super);

  function State() {
    State.__super__.constructor.call(this, this);
    this.$over = $("#over");
    this.$share = $("#share");
    this.state = "start";
    this.init();
  }

  State.prototype.init = function() {
    this.initOverState();
    this.initShareState();
    return window.addEventListener("touchstart", (function(_this) {
      return function() {
        if (_this.state === "start") {
          return _this.change("game");
        }
      };
    })(this));
  };

  State.prototype.initOverState = function() {
    $("#over div.again").addEventListener("touchstart", (function(_this) {
      return function(event) {
        event.stopPropagation();
        return _this.change("start");
      };
    })(this));
    return $("#over div.show-off").addEventListener("touchstart", (function(_this) {
      return function() {
        event.stopPropagation();
        return _this.change("share");
      };
    })(this));
  };

  State.prototype.initShareState = function() {
    return $("#share div.back").addEventListener("touchstart", (function(_this) {
      return function() {
        return _this.$share.style.display = "none";
      };
    })(this));
  };

  State.prototype.change = function(state) {
    if (__indexOf.call(states, state) < 0) {
      throw "" + state + " is not in states";
    }
    this.state = state;
    this.toggleOverState(state);
    if (state === "share") {
      this.showShare();
    }
    return this.emit(state);
  };

  State.prototype.toggleOverState = function(state) {
    if (state === "over" || state === "share") {
      return this.$over.style.display = "block";
    } else {
      return this.$over.style.display = "none";
    }
  };

  State.prototype.showShare = function() {
    return this.$share.style.display = "block";
  };

  return State;

})(EventEmitter);

module.exports = new State;



},{"../../lib/util":5,"eventemitter2":6}]},{},[11]);