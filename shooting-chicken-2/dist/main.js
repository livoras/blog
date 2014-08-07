(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var util = require("./util")
var EventEmitter = require("eventemitter2").EventEmitter2

EventEmitter.extend = util.extend

module.exports = EventEmitter

},{"./util":6,"eventemitter2":8}],2:[function(require,module,exports){
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

// Fastclick for mobile
window.addEventListener("load", function() {
    FastClick.attach(document.body)
})

},{}],4:[function(require,module,exports){
var Event = require("./event")

function ObjectsPool() {
    this.alives = []
    this.deads = []
    this.MAX_COUNT = 30
    this.newInstance = function() {
        throw new Error("newInstance should be impletemented")
    }
}

var ObjectsPoolMethods = {
    acquire: function() {
        if (this.deads.length > 0) {
            var obj = this.deads[this.deads.length - 1]
            this.emit("before alive", obj)
            var obj = this.deads.pop()
            this.alives.push(obj)
            this.emit("alive", obj)
        } else {
            var total = this.alives.length + this.deads.length
            if (total < this.MAX_COUNT) {
                this.emit("new instance", obj)
                var obj = this.newInstance()
                this.alives.push(obj)
            } else {
                this.emit("exceed")
                console.warn("Exceed maximal objects.")
            }
        }
        return obj 
    },
    alive: function(obj) {
        var deads = this.deads
        for(var i = 0, len = deads.length; i < len; i++) {
            if (deads[i] === obj) {
                this.emit("before alive", obj)
                deads.splice(i, 1)
                this.alives.push(obj)
                this.emit("alive", obj)
                break
            }
        }
    },
    die: function(obj) {
        var alives = this.alives
        for(var i = 0, len = alives.length; i < len; i++) {
            if (alives[i] === obj) {
                this.emit("before dying", obj)
                alives.splice(i, 1)
                this.deads.push(obj)
                this.emit("died", obj)
                break
            }
        }
    },
    dieAll: function() {
        var alives = this.alives
        for(var i = 0, len = alives.length; i < len; i++) {
            var obj = alives[alives.length - 1]
            this.emit("before dying", obj)
            alives.pop()
            this.deads.push(obj)
            this.emit("died", obj)
        }
        this.emit("all died")
    },
    aliveAll: function() {
        var deads = this.deads
        for(var i = 0, len = deads.length; i < len; i++) {
            var obj = deads[deads.length - 1]
            this.emit("before alive", obj)
            deads.pop()
            this.alives.push(obj)
            this.emit("alive", obj)
        }
        this.emit("all alive")
    }
}

module.exports = Event.extend(ObjectsPool, ObjectsPoolMethods)

},{"./event":1}],5:[function(require,module,exports){
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

},{"./event":1}],6:[function(require,module,exports){
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

module.exports = {
    extend: extend,
    $: $
}

},{}],7:[function(require,module,exports){
function Vector(x, y, vx, vy) {
    this.x = x || 0
    this.y = y || 0
    this.vx = vx || 0
    this.vy = vy || 0
}

Vector.prototype.update = function() {
    this.x += this.vx
    this.y += this.vy
}

module.exports = Vector

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
var ObjectsPool = require("../lib/objects-pool")
var Bullet = require("./bullet")

var canvas
var ctx
var game
var cannon
var timer = null

var SPEED = 10
var DURATION = 200

var bulletManager = new ObjectsPool

bulletManager.newInstance = function() {
    var vector = getCurrentVector()
    var bullet = new Bullet(vector.x, vector.y, vector.vx, vector.vy)
    onOutOfBorder(bullet)
    return bullet
}

function getCurrentVector() {
    var angle = cannon.angle / 180 * Math.PI
    var sin = Math.sin(angle)
    var cos = Math.cos(angle)
    var originX = cannon.originX
    var originY = cannon.originY
    var line = cannon.img.height / 2
    var vector = {
        x: originX + line * sin,
        y: originY - line * cos,
        vx: SPEED * sin,
        vy: -SPEED * cos
    }
    return vector
}

function onOutOfBorder(bullet) {
    bullet.on("out of border", function() {
        bulletManager.killBullet(bullet)
    })
}

bulletManager.init = function(cvs, g, c) {
    canvas = cvs
    game = g
    cannon = c
    ctx = canvas.getContext("2d")
    Bullet.init(canvas)
}

bulletManager.start = function() {
    clearInterval(timer)
    timer = setInterval(function() {
        var bullet = bulletManager.acquire()
        if (bullet) {
            var vector = getCurrentVector()
            bullet.reset(vector.x, vector.y, vector.vx, vector.vy)
            game.add(bullet)
        }
    }, DURATION)
}

bulletManager.stop = function() {
    clearInterval(timer)
    bulletManager.dieAll()
}

bulletManager.killBullet = function(bullet) {
    game.remove(bullet, function() {
        bulletManager.die(bullet)
    })
}

module.exports = bulletManager
},{"../lib/objects-pool":4,"./bullet":10}],10:[function(require,module,exports){
var Vector = require("../lib/vector")
var Event = require("../lib/event")
var r = require("../lib/r")
var canvas
var ctx
var bulletImg = null


function Bullet(x, y, vx, vy) {
    this.vector = new Vector(x, y, vx, vy)
}

var BulletMethods = {
    reset: function(x, y, vx, vy) {
        this.vector.x = x 
        this.vector.y = y
        this.vector.vx = vx
        this.vector.vy = vy
        this.radius = 10
    },
    move: function() {
        this.vector.update()
        if (this.isOutOfBorder()) {
            this.emit("out of border")
        }
        this.draw()
    },
    draw: function() {
        ctx.save()
        ctx.translate(this.vector.x, this.vector.y)
        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 2 * Math.PI, false)
        var pattern = ctx.createPattern(bulletImg, "repeat")
        ctx.fillStyle = pattern
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    },
    isOutOfBorder: function() {
        var vector = this.vector
        return vector.x < 0 || 
               vector.x > canvas.width ||
               vector.y < 0 ||
               vector.y > canvas.height
    }
}

Bullet = Event.extend(Bullet, BulletMethods)
Bullet.init = function(cvs) {
    canvas = cvs
    ctx = canvas.getContext("2d")
    bulletImg = r.images.get("bullet")
}

module.exports = Bullet

},{"../lib/event":1,"../lib/r":5,"../lib/vector":7}],11:[function(require,module,exports){
var Chick = require("./chick")
var ObjectsPool = require("../lib/objects-pool")

var chickManger = new ObjectsPool
var canvas = null

chickManger.newInstance = function() {
    var newChick = new Chick(canvas)
    onChickDie(newChick)
    onChickNotCatch(newChick)
    return newChick
}

function onChickDie(chick) {
    chick.on("die", function() {
        chickManger.die(chick)
    })
}

chickManger.on("died", function(chick) {
    chick.isToRemove = true
    chick.reset()
})

function onChickNotCatch(chick) {
    chick.on("not catch", function() {
        chickManger.emit("not catch", chick)
    })
}

chickManger.on("alive", function(chick) {
    chick.isToRemove = false
})

chickManger.init = function(cvs) {
    canvas = cvs
}

module.exports = chickManger

},{"../lib/objects-pool":4,"./chick":12}],12:[function(require,module,exports){
var Event = require("../lib/event")
var r = require("../lib/r")

var chickImg
var chickImg2
var dieImg
var catchImg

var gravity = 0.1
var INIT_VETOR_Y = 5
var INIT_VETOR_X = 4

function Chick(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.reset()
}

var chickPrototype = {
    reset: function() {
        this.isDie = false
        this.width = chickImg.width
        this.height = chickImg.height
        this.isCatch = false
        this.x = canvas.width / 4 + Math.random() * (canvas.width / 2)
        this.y = canvas.height * 0.4
        this.opacity = 1
        this.vx = -INIT_VETOR_X + Math.random() * INIT_VETOR_X * 2
        this.vy =  -3 + (-Math.random() * INIT_VETOR_Y)
        this.currentImg = chickImg
        this.count = 0
    },
    move: function() {
        if (!this.isDie) {
            this.updatePos()
            this.detectBorder()
        }
        this.draw()
    },
    updatePos: function() {
        this.x += this.vx
        this.y += this.vy
        if (!this.isDie) {
            this.vy += gravity
        }
    },
    detectBorder: function() {
        if(this.x < 5) {
            this.vx *= -0.65
            this.vy *= 0.7
            this.x = 5
        } else if (this.x + chickImg.width > this.canvas.width) {
            this.vx *= -0.65
            this.vy *= 0.7
            this.x = this.canvas.width - chickImg.width
        }

        if (this.y > this.canvas.height - chickImg.height - 130) {
            this.emit("not catch")
            this.die()
        } else if (this.y < 5) {
            this.vy *= -0.65
            this.vx *= 0.7
            this.y = 5
        }
    },
    die: function() {
        this.isDie = true
        this.vy = 0
        this.vx = 0
        var that = this
        setTimeout(function() {
            that.emit("die")
        }, 1000)
    },
    draw: function() {
        var ctx = this.ctx
        var img = this.isDie ? dieImg : this.nextImg()
        var img = this.isCatch ? catchImg: img
        ctx.save()
        if (this.isDie) {
            ctx.globalAlpha = this.opacity
            this.opacity -= 0.01
        }
        ctx.drawImage(img, this.x, this.y)
        ctx.restore()
    },
    nextImg: function() {
        if (this.count < 10) {
            this.count++
            return this.currentImg
        }
        this.count = 0
        this.currentImg = this.currentImg == chickImg2 ? chickImg : chickImg2
        return this.currentImg
    }
}

Chick = Event.extend(Chick, chickPrototype)

Chick.init = function() {
    chickImg = r.images.get("chick")
    chickImg2 = r.images.get("chick2")
    dieImg = r.images.get("die")
    catchImg = r.images.get("chick-in-catch")
}

module.exports = Chick

},{"../lib/event":1,"../lib/r":5}],13:[function(require,module,exports){
var collision = {}
var chicks = null
var bullets = null
var scoreChick = null

collision.init = function(_chickManager, _bulletManager, catchAndScore) {
	chickManager = _chickManager
	bulletManager = _bulletManager
	scoreChick = catchAndScore
}

collision.move = function() {
	chickManager.alives.forEach(function(chick) {
		if (chick.isCatch || chick.isDie) return;
		bulletManager.alives.forEach(function(bullet) {
			if (isChickAndBulletCollision(chick, bullet)) {
				scoreChick(chick)
				bulletManager.killBullet(bullet)
			}
		})
	})
}

function isChickAndBulletCollision(chick, bullet) {
	var radius = bullet.radius
	var x = chick.x - radius
	var y = chick.y - radius
	var height = chick.height
	var width = chick.width
	if ( bullet.vector.x >= x && 
		(bullet.vector.x <= (x + width + radius * 2)) &&
		(bullet.vector.y >= y) &&
		(bullet.vector.y <= (y + height + radius * 2)) ) return true
	return false
}

module.exports = collision

},{}],14:[function(require,module,exports){
var r = require("../lib/r")
var dogImg

var dog = {
    init: function(canvas) {
        dogImg = r.images.get("dog")
        this.x = canvas.width - dogImg.width - 30,
        this.y = 30
        this.ctx = canvas.getContext("2d")
    },
    move: function() {
        this.ctx.drawImage(dogImg, this.x, this.y)
    }
}

module.exports = dog

},{"../lib/r":5}],15:[function(require,module,exports){
var $ = require("../lib/util").$
var Event = require("../lib/event")
var r = require("../lib/r")
var canvas = null
var cannonImg = null
var ctx = null

function GunConstructor() {
    this.ctx = null
    this.angle = 0
    this.MAX_ANGLE = 60
    this.MIN_ANGLE = -60
    this.originX = 0
    this.originY = 0
    this.GAP = 2
}

var gunPrototype = {
    init: function(cvs) {
        canvas = cvs
        cannonImg = r.images.get("gun")
        ctx = canvas.getContext("2d")
        this.img = cannonImg
        this.initControl()
        this.initMove()
    },
    move: function() {
        this.updateOrigin()
        ctx.save()
        ctx.translate(canvas.width / 2, (canvas.height - cannonImg.height * 0.5))
        ctx.rotate(this.angle * Math.PI / 180)
        ctx.drawImage(cannonImg, -cannonImg.width / 2, -cannonImg.height / 2, cannonImg.width, cannonImg.height)
        ctx.restore()
    },
    updateOrigin: function() {
        this.originX = canvas.width / 2
        this.originY = canvas.height - cannonImg.height / 2
    },
    initControl: function() {
        var that = this
        canvas.addEventListener("touchstart", function() {
            var x = event.touches[0].pageX
            var y = event.touches[0].pageY
            that.touchX = x
            that.isControl = that.isInCannon(x, y)
        })
    },
    initMove: function() {
        var that = this
        canvas.addEventListener("touchmove", function(event) {
            if (!that.isControl) return
            var x = event.touches[0].pageX
            var y = event.touches[0].pageY
            var originX = that.originX
            var originY = that.originY
            var tan = (x - originX) / (y - originY)
            var newTangle = -Math.atan(tan) * 180 / Math.PI
            if (Math.abs(newTangle) > 60) return
            that.angle = newTangle
        })  
    },
    isInCannon: function(x, y) {
        var upperHeight = canvas.height
        var lowerHeight = canvas.height - cannonImg.height
        var upperWidth = canvas.width / 2 + cannonImg.height / 2
        var lowerWidth = canvas.width / 2 - cannonImg.height / 2
        if (y > lowerHeight &&
            y < upperHeight &&
            x > lowerWidth &&
            x < upperWidth) return true
        return false
    }
}

var Gun = Event.extend(GunConstructor, gunPrototype)
module.exports = new Gun()

},{"../lib/event":1,"../lib/r":5,"../lib/util":6}],16:[function(require,module,exports){

exports.read = function() {
    var record = localStorage.getItem("stats")
    if (record) {
        return JSON.parse(record)
    }
}

exports.write = function(status) {
    localStorage.setItem("stats", JSON.stringify(status))
}

},{}],17:[function(require,module,exports){
var score = $("#stats-score")
var lifes = $("#stats-lifes")
var level = $("#stats-level")
var mask = $("#mask")
var stats = $("#stats")
var highest = $("#highest")
var scoreShow = $("#score-show")
var youScore = $("#your-score")
var newRecord = $("#new-record")
var scoreLocal = 0

var cacheScore = 0
var cacheLevel = 0
var cacheLifes = 0

exports.hidePannel = function () {
    mask.style.display = "none"
    showStats()
    showScore()
    hideNewRecord()
}

exports.showPannel = function (status) {
    mask.style.display = "block"
    hideStats()
    updateScore()
}

exports.updateStats = function(status) {
    if (cacheLifes !== status.lifes) {
        var lifesHTML = ""
        for (var i = 0, len = status.lifes; i < len; i++) {
            lifesHTML += "<image src='img/love.png'>"
        }
        lifes.innerHTML = lifesHTML
        cacheLifes = status.lifes
    }
    if (cacheLevel !== status.level) {
        level.innerHTML = status.level
        cacheLevel = status.level
    }
    if (cacheScore !== status.score) {
        cacheScore = status.score
        score.innerHTML = scoreLocal = status.score
    }
}

exports.updateRecord = function(num) {
    highest.innerHTML = num
}

exports.showNewRecord = function() {
    newRecord.style.display = "inline-block"
}

function hideNewRecord() {
    newRecord.style.display = "none"
}

function $(selector) {
    return document.querySelector(selector)
}

function showStats() {
    stats.style.display = "block"

}

function hideStats() {
    stats.style.display = "none"
}

function showScore() {
    scoreShow.style.display = "block"
}

function updateScore() {
    youScore.innerHTML = scoreLocal
}


hideStats()

},{}],18:[function(require,module,exports){
var Game = require("../lib/game")
var r = require("../lib/r")
var Chick = require("../src/chick")
var Bullet = require("../src/bullet")
var dog = require("../src/dog")
var gun = require("../src/gun")
var pannel = require("../src/pannel")
var chickManager = require("../src/chick-manager")
var bulletManager = require("../src/bullet-manager")
var collision = require("../src/collision")
var localRecord = require("../src/local-record")

var game = new Game
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var world = null
var throwTimer = null
var playAroundChicks = []
var record = localRecord.read() || {highest: 0}
var LEVEL_START_DURATION = 800

var levelTimer = null
var LEVEL_UP_DURATON = 10 // s
var isMobile = false

var status = {
    lifes: 5,
    score: 0,
    level: 1
}

game.on("init", function() {
    drawBackground()
    chickManager.init(canvas)
    collision.init(chickManager, bulletManager, catchAndScore)
    resizeCanvas()

    listenMouseDown()
    listenResize()
    listenNotCatch()
    listenPannelButtons()
    renderRecord()
    playAround()

    game.add(world)
    game.add(gun)
    game.add(collision)

})

game.on("start", function() {
    pannel.hidePannel()
    stopPlayAround()
    pannel.updateStats(status)
    startToThrowChick()
    bulletManager.start()
    startToCountLevel()
})

game.on("stop", function() {
    stopToCountLevel()
    stopThrowingChick()
    bulletManager.stop()
    resetStatus()
    cleanScreen()
    pannel.showPannel()
    playAround()
})

setupResources()

function setupResources() {
    r.on("all images loaded", function() {
        Chick.init()
        dog.init(canvas)
        gun.init(canvas)
        bulletManager.init(canvas, game, gun)
        game.init()
    })
    r.images.set("bg", "img/bg.png")
    r.images.set("chick", "img/chick.png")
    r.images.set("chick2", "img/chick-2.png")
    r.images.set("die", "img/die.png")
    r.images.set("chick-in-catch", "img/catch.png")
    r.images.set("dog", "img/dog.png")
    r.images.set("gun", "img/cannon.png")
    r.images.set("bullet", "img/bullet.png")
}

function resetStatus() {
    status.lifes = 5
    status.score = 0
    status.level = 1
}

function cleanScreen() {
    chickManager.dieAll()
}

function playAround(arguments) {
    // if (playAroundChicks.length == 0) {
    //     for(var i = 0, len = 4; i < len; i++) {
    //         var chick = new Chick(canvas)
    //         playAroundChicks.push(chick)
    //         chick.on("die", function() {
    //             console.log('....die')
    //             chick.reset()
    //         })
    //     }
    // }
    console.log('play around')
    // playAroundChicks.forEach(function(chick) {
    //     game.add(chick)
    // })
}

function stopPlayAround() {
    // game.pause()
    console.log('stopPlayAround')
    // playAroundChicks.forEach(function(chick) {
    //     game.remove(chick)
    // })
}

function listenNotCatch() {
    chickManager.on("not catch", function() {
        if (game.isResume) {
            status.lifes--
            pannel.updateStats(status)
            if (status.lifes == 0) {
                gameover()
            }
        }
    })
}

function drawBackground() {
    var bgImg = r.images.get("bg")
    world = {
        move: function() {
            ctx.save()
            ctx.fillStyle = "#FFFCDD"
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            pattern = ctx.createPattern(bgImg, "repeat")
            ctx.translate(0, canvas.height - bgImg.height)
            ctx.fillStyle = pattern
            ctx.fillRect(0, 0, canvas.width, bgImg.height)
            ctx.restore()
        }
    }
    world.move()
}

function gameover() {
    if (status.score > record.highest) {
        record.highest = status.score
        renderRecord()
        localRecord.write(record)
        newRecord()
    }
    setTimeout(function() {
        game.stop()
    })
}

function newRecord() {
    pannel.showNewRecord()
}

function stopThrowingChick() {
    clearInterval(throwTimer)
}

function startToThrowChick() {
    throwTimer = setTimeout(function() {
        var chick = chickManager.acquire()
        if (chick) {
            game.add(chick)
        } else {
            console.log("chicks is out of range.")
        }
        startToThrowChick()
    }, LEVEL_START_DURATION - 50 * (status.level - 1))
}

function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

function listenResize() {
    window.addEventListener("resize", resizeCanvas)
}

function listenMouseDown() {
    canvas.addEventListener("touchstart", function(event) {
        isMobile = true
        event.preventDefault()
        var x = event.touches[0].pageX
        var y = event.touches[0].pageY
        shootChicks(x, y)
    })
    canvas.addEventListener("touchend", function(event) {
        event.preventDefault()
    })
    canvas.addEventListener("mousedown", function(event) {
        if (!isMobile) {
            shootChicks(event.clientX, event.clientY)
            console.log("is not a mobile")
        }
    })
    canvas.addEventListener("dblclick", function(event) {
        event.stopPropagation()
        event.preventDefault()
    })
}

function shootChicks(x, y) {
    if (game.isResume) {
        chickManager.alives.forEach(function(chick) {
            if (x > chick.x && 
                x < chick.x + chick.width &&
                y > chick.y &&
                y < chick.y + chick.height) catchAndScore(chick)
        })
    }
}

function catchAndScore(chick) {
    if (!chick.isDie) {
        chick.isCatch = true
        chick.die()
        score()
    }
}

function score() {
    status.score += 100
    pannel.updateStats(status)
}

function listenPannelButtons() {
    var play = document.getElementById("play")
    function start() {
        if (game.isStop) {
            game.start()
        }
    }
    play.addEventListener("touchstart", start)
    play.addEventListener("mousedown", start)
}

function renderRecord() {
    pannel.updateRecord(record.highest)
}

function startToCountLevel() {
    levelTimer = setInterval(function() {
        status.level++
        showDog()
        pannel.updateStats(status)
    }, LEVEL_UP_DURATON * 1000)
}

function showDog() {
    dog.isToRemove = false
    game.add(dog)
    setTimeout(function() {
        game.remove(dog)
    }, 1000)
}

function stopToCountLevel() {
    clearInterval(levelTimer)
}

// TESTS, should be removed
// require("./tests")

},{"../lib/game":2,"../lib/r":5,"../src/bullet":10,"../src/bullet-manager":9,"../src/chick":12,"../src/chick-manager":11,"../src/collision":13,"../src/dog":14,"../src/gun":15,"../src/local-record":16,"../src/pannel":17}]},{},[18])