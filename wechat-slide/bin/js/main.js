(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
    "images": [
        {"url": "img/foo4.jpg", "text": "这是一个美女", "name": "Jimmy"},
        {"url": "img/foo1.png", "text": "这是一个美女", "name": "Lucy"},
        {"url": "img/foo2.jpg", "text": "这是一个美女", "name": "Tony"},
        {"url": "img/foo3.jpg", "text": "这是一个美女", "name": "Honey"},
        {"url": "img/foo5.jpg", "text": "这是一个美女", "name": "Jerry"}
    ]
}
},{}],2:[function(require,module,exports){
var $, $cover, $currentActive, $dashboard, $left, $right, $wall, Iterator, SLIDE_DURATION, THUMB_HEIGHT, THUMB_WIDTH, active, addClass, appenStyle, data, deactive, degs, headIter, images, imgDoms, init, initDashboard, initData, initImages, initSlideCircle, initSwitches, isSliding, next, perDeg, piToDeg, prev, processSlideDom, radius, removeClass, resetRotate, setBackground, setRotate, slideBackward, slideForward, tailIter, util, visibleImgsCount;

data = require("./data.json");

util = require("./util.coffee");

images = data.images;

visibleImgsCount = 0;

degs = null;

perDeg = 0;

radius = 0;

headIter = null;

tailIter = null;

imgDoms = [];

isSliding = false;

$cover = null;

$wall = null;

$left = null;

$right = null;

$dashboard = null;

$currentActive = null;

THUMB_HEIGHT = 100;

THUMB_WIDTH = 65;

SLIDE_DURATION = 530;

$ = util.$, Iterator = util.Iterator, addClass = util.addClass, removeClass = util.removeClass, setBackground = util.setBackground, setRotate = util.setRotate;

init = function() {
  $wall = $("div.wall");
  $cover = $("div.cover");
  $left = $("div.left");
  $right = $("div.right");
  $dashboard = $("div.dashboard");
  initData();
  initSwitches();
  initDashboard();
  return next();
};

initData = function() {
  return images.forEach(function(img, i) {
    return img.index = i;
  });
};

initSwitches = function() {
  $left.on("touchstart", function() {
    return prev();
  });
  return $right.on("touchstart", function() {
    return next();
  });
};

initDashboard = function() {
  var half, i, imgLoops, l, perPI, r, rh, rw, totalDeg, totalPI, w, _i;
  rh = $dashboard.offsetHeight - THUMB_HEIGHT;
  rw = $dashboard.offsetWidth / 2;
  radius = 0.5 * (rw * rw + rh * rh) / rh;
  l = rw * 2;
  w = THUMB_WIDTH * 2;
  r = radius;
  perPI = Math.atan(0.5 * w / r);
  perDeg = piToDeg(perPI);
  totalPI = 2 * Math.asin(0.5 * l / r);
  totalDeg = piToDeg(totalPI);
  visibleImgsCount = Math.round(totalPI / perPI);
  if (visibleImgsCount % 2 === 0) {
    visibleImgsCount++;
  }
  imgLoops = [0];
  half = (visibleImgsCount - 1) / 2;
  for (i = _i = 1; 1 <= half ? _i <= half : _i >= half; i = 1 <= half ? ++_i : --_i) {
    imgLoops.push(i * perDeg);
    imgLoops.unshift(-i * perDeg);
  }
  degs = imgLoops;
  appenStyle(radius + THUMB_HEIGHT);
  initImages();
  return initSlideCircle();
};

initImages = function() {
  var $div, deg, i, img, imgIter, _i, _len;
  imgIter = new util.Iterator(images, true);
  headIter = new util.Iterator(images, true);
  for (i = _i = 0, _len = degs.length; _i < _len; i = ++_i) {
    deg = degs[i];
    img = imgIter.current();
    imgIter.next();
    $div = document.createElement("div");
    $div.className = "img transition";
    $div.style.webkitTransform = "rotateZ(" + (deg + 'deg') + ")";
    $div.imgIndex = img.index;
    setBackground($div, img.url);
    imgDoms.push($div);
    $dashboard.appendChild($div);
  }
  tailIter = imgIter;
  return tailIter.prev();
};

initSlideCircle = function() {
  var THRESHOLD, currentPageX, originPageX;
  currentPageX = originPageX = 0;
  THRESHOLD = 50;
  $dashboard.on("touchstart", function(event) {
    var touch;
    event.preventDefault();
    touch = event.touches[0];
    return currentPageX = originPageX = touch.pageX;
  });
  $dashboard.on("touchmove", function(event) {
    var touch;
    event.preventDefault();
    touch = event.touches[0];
    return currentPageX = touch.pageX;
  });
  return $dashboard.on("touchend", function(event) {
    event.preventDefault();
    if (currentPageX > originPageX && currentPageX - originPageX > THRESHOLD) {
      return prev();
    } else if (originPageX > currentPageX && originPageX - currentPageX > THRESHOLD) {
      return next();
    }
  });
};

piToDeg = function(pi) {
  return pi / Math.PI * 180;
};

appenStyle = function(radius) {
  var style;
  style = document.createElement("style");
  style.innerHTML = "div.dashboard div.img,\ndiv.dashboard {\n    transform-origin: 50% " + radius + "px;\n    -webkit-transform-origin: 50% " + radius + "px;\n}";
  return document.body.appendChild(style);
};

next = function() {
  var imgData;
  if (isSliding) {
    return;
  }
  isSliding = true;
  setTimeout(function() {
    return isSliding = false;
  }, SLIDE_DURATION);
  imgData = slideForward();
  $wall.style.backgroundImage = "url(" + imgData.url + ")";
  return $cover.style.backgroundImage = "url(" + imgData.url + ")";
};

prev = function() {
  var imgData;
  if (isSliding) {
    return;
  }
  isSliding = true;
  setTimeout(function() {
    return isSliding = false;
  }, SLIDE_DURATION);
  imgData = slideBackward();
  $wall.style.backgroundImage = "url(" + imgData.url + ")";
  return $cover.style.backgroundImage = "url(" + imgData.url + ")";
};

slideForward = function() {
  var $img, imgData, nextImgIndex;
  deactive($currentActive);
  $img = imgDoms.shift();
  headIter.next();
  imgData = tailIter.next();
  imgDoms.push($img);
  processSlideDom($img, imgData);
  $currentActive = imgDoms[(visibleImgsCount - 1) / 2];
  active($currentActive);
  nextImgIndex = $currentActive.imgIndex;
  return images[nextImgIndex];
};

slideBackward = function() {
  var $img, imgData, nextImgIndex;
  deactive($currentActive);
  $img = imgDoms.pop();
  tailIter.prev();
  imgData = headIter.prev();
  imgDoms.unshift($img);
  processSlideDom($img, imgData);
  $currentActive = imgDoms[(visibleImgsCount - 1) / 2];
  active($currentActive);
  nextImgIndex = $currentActive.imgIndex;
  return images[nextImgIndex];
};

active = function($img) {
  return addClass($img, "active");
};

deactive = function($img) {
  return removeClass($img, "active");
};

processSlideDom = function($img, imgData) {
  removeClass($img, "transition");
  setBackground($img, imgData.url);
  $img.imgIndex = imgData.index;
  resetRotate();
  return setTimeout(function() {
    return addClass($img, "transition");
  }, SLIDE_DURATION);
};

resetRotate = function() {
  var $img, i, _i, _len, _results;
  _results = [];
  for (i = _i = 0, _len = imgDoms.length; _i < _len; i = ++_i) {
    $img = imgDoms[i];
    _results.push(setRotate($img, degs[i]));
  }
  return _results;
};

init();



},{"./data.json":1,"./util.coffee":3}],3:[function(require,module,exports){
var $, Iterator, addClass, removeClass, setBackground, setRotate,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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

removeClass = function($dom, className) {
  var klass;
  if (!$dom) {
    return;
  }
  klass = $dom.className;
  return $dom.className = klass.replace(RegExp("\\s" + className + "\\s?"), " ");
};

addClass = function($dom, className) {
  var classes;
  if (!$dom) {
    return;
  }
  classes = $dom.className.split(" ");
  if (__indexOf.call(classes, className) < 0) {
    if ($dom.className.match(/\s$/)) {
      return $dom.className += "" + className;
    } else {
      return $dom.className += " " + className;
    }
  }
};

setBackground = function($dom, url) {
  return $dom.style.backgroundImage = "url(" + url + ")";
};

setRotate = function($dom, deg) {
  return $dom.style.webkitTransform = "rotateZ(" + (deg + 'deg') + ")";
};

Iterator = (function() {
  function Iterator(list, isLoop) {
    this.list = list;
    this.index = 0;
    this.isLoop = isLoop || false;
  }

  Iterator.prototype.set = function(index) {
    return this.index = index;
  };

  Iterator.prototype.next = function() {
    if (this.index + 1 === this.list.length) {
      if (this.isLoop) {
        this.index = 0;
      } else {
        return;
      }
    } else {
      this.index++;
    }
    return this.list[this.index];
  };

  Iterator.prototype.prev = function() {
    if (this.index - 1 <= 0) {
      if (this.isLoop) {
        this.index = this.list.length - 1;
      } else {
        return;
      }
    } else {
      this.index--;
    }
    return this.list[this.index];
  };

  Iterator.prototype.current = function() {
    return this.list[this.index];
  };

  return Iterator;

})();

module.exports = {
  $: $,
  Iterator: Iterator,
  addClass: addClass,
  removeClass: removeClass,
  setBackground: setBackground,
  setRotate: setRotate
};



},{}]},{},[2]);