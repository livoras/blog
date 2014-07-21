;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var Game = require("../src/game")
var Chick = require("../src/chick")
var dog = require("../src/dog")
var pannel = require("../src/pannel")
var chickManager = require("../src/chick-manager")
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
    resizeCanvas()
    listenMouseDown()
    listenResize()
    listenNotCatch()
    listenPannelButtons()
    renderRecord()
    playAround()
    dog.init(canvas)
    game.add(world)
})

window.addEventListener("load", function() {
    FastClick.attach(document.body)
})

game.on("start", function() {
    pannel.hidePlannel()
    stopPlayAround()
    pannel.updateStats(status)
    startToThrowChick()
    startToCountLevel()
})

game.on("stop", function() {
    stopToCountLevel()
    stopThrowingChick()
    resetStatus()
    cleanScreen()
    pannel.showPannel()
    playAround()
})

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

var bgImg = new Image()
bgImg.addEventListener("load", function() {
    game.init()
})
bgImg.src = "img/bg.png"

function drawBackground() {
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
        chickManager.aliveChicks.forEach(function(chick) {
            if (x > chick.x && 
                x < chick.x + chick.width &&
                y > chick.y &&
                y < chick.y + chick.height) {
                if (!chick.isDie) {
                    chick.isCatch = true
                    chick.die()
                    score()
                }
            }
        })
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

},{"../src/game":2,"../src/chick":3,"../src/dog":4,"../src/chick-manager":5,"../src/pannel":6,"../src/local-record":7}],4:[function(require,module,exports){
var dogImg = new Image()
dogImg.src = "img/dog.png"

var dog = {
    init: function(canvas) {
        this.x = canvas.width - dogImg.width - 30,
        this.y = 30
        this.ctx = canvas.getContext("2d")
    },
    move: function() {
        this.ctx.drawImage(dogImg, this.x, this.y)
    }
}

module.exports = dog

},{}],6:[function(require,module,exports){
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

exports.hidePlannel = function () {
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

},{}],7:[function(require,module,exports){

exports.read = function() {
    var record = localStorage.getItem("stats")
    if (record) {
        return JSON.parse(record)
    }
}

exports.write = function(status) {
    localStorage.setItem("stats", JSON.stringify(status))
}

},{}],2:[function(require,module,exports){
require("./animation")

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
        this.sprits.push(sprit)
        this.emit("sprit added", sprit)
    },
    remove: function(sprit) {
        sprit.isToRemove = true
        this.emit("sprit removed", sprit)
    }
}

module.exports = Event.extend(Game, gameMethods)

},{"./animation":8,"./event":9}],3:[function(require,module,exports){
var Event = require("./event")

var chickImg = new Image()
chickImg.src = "img/chick.png"

var chickImg2 = new Image()
chickImg2.src = "img/chick-2.png"

var dieImg = new Image()
dieImg.src = "img/die.png"

var catchImg = new Image()
catchImg.src = "img/catch.png"

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

module.exports = Event.extend(Chick, chickPrototype)

},{"./event":9}],5:[function(require,module,exports){
var Chick = require("./chick")
var Event = require("./event")

// chickManger is to maintain the objects pool
// for reducing memory consuming.
function ChickManager() {
    this.aliveChicks = []
    this.deadChicks = []
    this.MAX_CHICKS = 30
}

var chickManagerPrototype = {
    init: function(canvas) {
        this.canvas = canvas
        return this
    },
    acquire: function() {
        if (this.deadChicks.length > 0) {
            var newChick = this.deadChicks.pop()
            newChick.isToRemove = false
            this.aliveChicks.push(newChick)
        } else {
            var total = this.aliveChicks.length + this.deadChicks.length
            if (total < this.MAX_CHICKS) {
                var newChick = new Chick(this.canvas)
                this.onDie(newChick)
                this.onNotCatch(newChick)
                this.aliveChicks.push(newChick)
            }
        }
        return newChick
    },
    onDie: function(toDieChick) {
        var that = this
        toDieChick.on("die", function() {
            toDieChick.isToRemove = true
            toDieChick.reset()
            that.removeFromAlive(toDieChick)
        })
    },
    onNotCatch: function(chick) {
        var that = this
        chick.on("not catch", function() {
            that.emit("not catch", chick)
        })
    },
    removeFromAlive: function(toRemoveChick) {
        for (var i = 0, len = this.aliveChicks.length; i < len; i++) {
            var chick = this.aliveChicks[i]
            if (chick == toRemoveChick) {
                this.aliveChicks.splice(i, 1)
                this.deadChicks.push(toRemoveChick)
                break
            }
        }
    },
    removeFromDie: function(toRemoveChick) {
        for (var i = 0, len = this.deadChicks.length; i < len; i++) {
            var chick = this.deadChicks[i]
            if (chick == toRemoveChick) {
                toRemoveChick.isToRemove = false
                this.deadChicks.splice(i, 1)
                this.aliveChicks.push(toRemoveChick)
                break
            }
        }
    },
    dieAll: function() {
        var chick = this.aliveChicks.pop()
        while(this.aliveChicks.length) {
            chick.isToRemove = true
            chick.reset()
            this.deadChicks.push(chick)
            chick = this.aliveChicks.pop()
        }
    }
}

var ChickManager = Event.extend(ChickManager, chickManagerPrototype)
module.exports = new ChickManager

},{"./chick":3,"./event":9}],8:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
function extend(Constructor, prototype) {
    var Super = this
    function Sub() { Constructor.apply(this, arguments) }
    function F() {}
    F.prototype = Super.prototype
    Sub.prototype = new F()
    for (var prop in prototype) {
        Sub.prototype[prop] = prototype[prop]
    }
    Sub.extend = extend
    return Sub
}

exports.extend = extend

},{}],9:[function(require,module,exports){
var util = require("./util")
var EventEmitter = require("eventemitter2").EventEmitter2

EventEmitter.extend = util.extend

module.exports = EventEmitter

},{"./util":10,"eventemitter2":11}],11:[function(require,module,exports){
(function(){/*!
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

})()
},{}]},{},[1])
;