(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    // FastClick.attach(document.body)
})

},{}],2:[function(require,module,exports){
module.exports={
    "images": [
        {"url": "img/button1.png", "target": "http://baidu.com/1"},
        {"url": "img/button2.png", "target": "http://baidu.com/2"},
        {"url": "img/button3.png", "target": "http://baidu.com/3"},
        {"url": "img/button4.png", "target": "http://baidu.com/4"},
        {"url": "img/button5.png", "target": "http://baidu.com/5"},
        {"url": "img/button6.png", "target": "http://baidu.com/6"}
    ]
}
},{}],3:[function(require,module,exports){
var $, BUTTON_SIZE, Button, GAP, RADIUS, buttons, canvas, canvasHeight, canvasWidth, ctx, data, images, init, initButtons, initClear, initEvents, moveBack, moveFront, pageX, pageY, resizeCanvas, startTime, util, world;

util = require("./util.coffee");

world = require("./world.coffee");

data = require("./data.json");

images = data.images;

$ = util.$;

canvas = $("#canvas");

canvasWidth = window.innerWidth;

canvasHeight = window.innerHeight;

ctx = canvas.getContext("2d");

BUTTON_SIZE = 95;

GAP = 8;

RADIUS = 0.5 * canvasWidth - (0.5 * BUTTON_SIZE + GAP);

buttons = [];

pageX = 0;

pageY = 0;

startTime = 0;

init = function() {
  resizeCanvas();
  initClear();
  initEvents();
  initButtons();
  return world.start();
};

resizeCanvas = function() {
  canvas.width = canvasWidth;
  return canvas.height = canvasHeight;
};

initClear = function() {
  var bg;
  bg = new Image;
  bg.src = "img/bg.png";
  return world.add({
    move: function() {
      ctx.save();
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(bg, 0, 0, canvasWidth, canvasHeight);
      return ctx.restore();
    }
  });
};

initEvents = function() {
  canvas.addEventListener("touchstart", function(event) {
    var touch;
    startTime = +(new Date);
    event.preventDefault();
    touch = event.touches[0];
    pageX = touch.pageX;
    return pageY = touch.pageY;
  });
  return canvas.addEventListener("touchmove", function(event) {
    var touch, x, y;
    event.preventDefault();
    touch = event.touches[0];
    x = touch.pageX;
    y = touch.pageY;
    if (Math.abs(x - pageX) < 15) {
      return;
    }
    if (y > canvasHeight / 2) {
      if (x > pageX) {
        moveBack();
      } else {
        moveFront();
      }
    } else {
      if (x > pageX) {
        moveFront();
      } else {
        moveBack();
      }
    }
    pageX = x;
    return pageY = y;
  });
};

moveFront = function() {
  var button, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = buttons.length; _i < _len; _i++) {
    button = buttons[_i];
    _results.push(button.go());
  }
  return _results;
};

moveBack = function() {
  var button, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = buttons.length; _i < _len; _i++) {
    button = buttons[_i];
    _results.push(button.back());
  }
  return _results;
};

initButtons = function() {
  var button, currentDeg, img, imgData, perDeg, _i, _len, _results;
  perDeg = 360 / images.length;
  currentDeg = 0;
  _results = [];
  for (_i = 0, _len = images.length; _i < _len; _i++) {
    imgData = images[_i];
    img = new Image;
    img.src = imgData.url;
    button = new Button(currentDeg, img, imgData.target);
    currentDeg += perDeg;
    buttons.push(button);
    _results.push(world.add(button));
  }
  return _results;
};

Button = (function() {
  function Button(deg, img, target) {
    this.deg = deg;
    this.img = img;
    this.target = target;
    this.max = 14;
    this.v = 0;
    this.pace = 0.7;
    this.force = 0.1;
    this.initEvents();
  }

  Button.prototype.move = function() {
    var piDeg;
    this.updateDeg();
    piDeg = this.deg / 180 * Math.PI;
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(piDeg);
    ctx.drawImage(this.img, -BUTTON_SIZE / 2, RADIUS - BUTTON_SIZE / 2, BUTTON_SIZE, BUTTON_SIZE);
    return ctx.restore();
  };

  Button.prototype.go = function() {
    this.v += this.pace;
    if (this.v >= this.max) {
      return this.v = this.max;
    }
  };

  Button.prototype.back = function() {
    this.v -= this.pace;
    if (this.v <= -this.max) {
      return this.v = -this.max;
    }
  };

  Button.prototype.stop = function() {
    return this.v = 0;
  };

  Button.prototype.updateDeg = function() {
    this.deg += this.v;
    if ((this.v + 0.001) * (this.v - this.force) < 0) {
      return this.v = 0;
    } else {
      if (this.v > 0) {
        return this.v -= this.force;
      } else {
        return this.v += this.force;
      }
    }
  };

  Button.prototype.initEvents = function() {
    return canvas.addEventListener("touchend", (function(_this) {
      return function(event) {
        var originX, originY, piDeg, x, y;
        if (+(new Date) - startTime > 500) {
          return;
        }
        piDeg = _this.deg / 180 * Math.PI;
        originX = (Math.sin(piDeg)) * RADIUS + 0.5 * canvasWidth;
        originY = -(Math.cos(piDeg)) * RADIUS + 0.5 * canvasHeight;
        x = originX - 0.5 * BUTTON_SIZE;
        y = originY - 0.5 * BUTTON_SIZE;
        if ((x < pageX && pageX < x + BUTTON_SIZE) && (y < pageY && pageY < y + BUTTON_SIZE)) {
          return window.location.href = _this.target;
        }
      };
    })(this));
  };

  return Button;

})();

init();



},{"./data.json":2,"./util.coffee":4,"./world.coffee":5}],4:[function(require,module,exports){
var $;

$ = function(selector) {
  var dom, doms;
  doms = document.querySelectorAll(selector);
  if (doms.length === 1) {
    dom = doms[0];
    dom.on = function() {
      return dom.addEventListener.apply(dom, arguments);
    };
    return doms[0];
  }
  return doms;
};

module.exports = {
  $: $
};



},{}],5:[function(require,module,exports){
var spirts, timer, world;

require("../../lib/anim");

world = {};

timer = null;

spirts = [];

world.start = function() {
  var run;
  run = function() {
    var spirt, _i, _len;
    for (_i = 0, _len = spirts.length; _i < _len; _i++) {
      spirt = spirts[_i];
      spirt.move();
    }
    return timer = requestAnimationFrame(run);
  };
  return run();
};

world.add = function(spirt) {
  return spirts.push(spirt);
};

module.exports = world;



},{"../../lib/anim":1}]},{},[3]);