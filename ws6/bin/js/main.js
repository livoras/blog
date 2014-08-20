(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, $buttons, $links, $scroller, PADDING, addLinks, canvasHeight, canvasWidth, init, radius, resizeButtons, resizeScroller, rotationSnap, rotationSnapPI, scroll, sh, sw, util;

util = require("./util.coffee");

$ = util.$;

canvasHeight = window.innerHeight;

canvasWidth = window.innerWidth;

PADDING = 10;

rotationSnap = 360 / 8;

radius = (canvasWidth + PADDING * 2) / 2;

rotationSnapPI = Math.PI / 8;

sw = (Math.sin(rotationSnapPI)) * radius * 2;

sh = sw * 361 / 565;

$scroller = $("#scroller");

$buttons = $("div.button");

$links = $("span.link");

init = function() {
  resizeButtons();
  resizeScroller();
  addLinks();
  return scroll();
};

resizeButtons = function() {
  return Array.prototype.forEach.call($buttons, function($button, i) {
    $button.style.height = "" + sh + "px";
    $button.style.width = "" + sw + "px";
    $button.style.webkitTransformOrigin = "50% " + radius + "px 0";
    return $button.style.webkitTransform = "rotateZ(" + (rotationSnap * i) + "deg)";
  });
};

resizeScroller = function() {
  var c;
  c = radius * 2;
  $scroller.style.bottom = "-" + c / 2 * 1.2 + "px";
  $scroller.style.width = c + "px";
  $scroller.style.height = c + "px";
  $scroller.style.webkitBorderRadius = c + "px";
  return $scroller.style.left = -PADDING + "px";
};

addLinks = function() {
  return Array.prototype.forEach.call($links, function($link, i) {
    return $link.addEventListener("click", function() {
      var link;
      link = $link.getAttribute("href");
      return window.location.href = link;
    });
  });
};

scroll = function() {
  return Draggable.create("#scroller", {
    type: "rotation",
    throwProps: true,
    snap: function(endValue) {
      return Math.round(endValue / rotationSnap) * rotationSnap;
    }
  });
};

init();



},{"./util.coffee":2}],2:[function(require,module,exports){
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



},{}]},{},[1]);