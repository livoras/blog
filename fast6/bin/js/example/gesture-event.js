(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $window, currentPos, gestureEvent, getPos, startPos, startTime;

gestureEvent = new EventEmitter2;

$window = $(window);

currentPos = null;

startPos = null;

startTime = null;

$window.on("touchstart", function(event) {
  var pos;
  startTime = +(new Date);
  startPos = currentPos = pos = getPos(event);
  return gestureEvent.emit("touchstart", currentPos);
});

$window.on("touchmove", function(event) {
  var absDistY, distY, pos;
  currentPos = pos = getPos(event);
  gestureEvent.emit("touchstart", currentPos);
  distY = currentPos.y - startPos.y;
  absDistY = Math.abs(distY);
  if (distY < 0) {
    return gestureEvent.emit("swiping up", absDistY);
  } else {
    return gestureEvent.emit("swiping down", absDistY);
  }
});

$window.on("touchend", function(event) {
  var absDistY, currentTime, distTime, distY, velocity;
  gestureEvent.emit("touchend", currentPos);
  currentTime = +(new Date);
  distTime = currentTime - startTime;
  distY = currentPos.y - startPos.y;
  absDistY = Math.abs(distY);
  velocity = absDistY / distTime;
  if (distY < 0) {
    return gestureEvent.emit("swipe up", absDistY, velocity, distTime);
  } else {
    return gestureEvent.emit("swipe down", absDistY, velocity, distTime);
  }
});

getPos = function(event) {
  var x, y;
  x = event.clientX || event.touches[0].clientX;
  y = event.clientY || event.touches[0].clientY;
  return {
    x: x,
    y: y
  };
};

module.exports = gestureEvent;



},{}]},{},[1]);