(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
This module is used to cache the common used constains variables like
Keyboard Codes and window height and width.
 */
exports.HEIGHT = document.documentElement.clientHeight;

exports.WIDTH = document.documentElement.clientWidth;

exports.A_KEY = 65;

exports.W_KEY = 87;

exports.D_KEY = 68;

exports.S_KEY = 83;

exports.J_KEY = 74;



},{}],2:[function(require,module,exports){
var lastTime, vendors, x;

lastTime = 0;

vendors = ["webkit", "moz"];

x = 0;

while (x < vendors.length && !window.requestAnimationFrame) {
  window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
  window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
  ++x;
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback, element) {
    var currTime, id, timeToCall;
    currTime = new Date().getTime();
    timeToCall = Math.max(0, 16 - (currTime - lastTime));
    id = window.setTimeout(function() {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}



},{}],3:[function(require,module,exports){
var A_KEY, D_KEY, HEIGHT, J_KEY, MAN_SPRITE, STUPID_SPRITE, S_KEY, WIDTH, W_KEY, addBackground, create, direct, game, initGame, isJump, isTouchLeft, isTouchRight, jump, ledges, listenAndMakeManMove, listenTouch, makeButtons, makeLedge, makeMan, makePhysicsWorld, makeScore, makeStars, man, preload, runLeft, runRight, score, scoreText, stars, update, velocity, _ref;

require("./init.coffee");

_ref = require("./constants.coffee"), HEIGHT = _ref.HEIGHT, WIDTH = _ref.WIDTH, A_KEY = _ref.A_KEY, D_KEY = _ref.D_KEY, W_KEY = _ref.W_KEY, S_KEY = _ref.S_KEY, J_KEY = _ref.J_KEY;

game = null;

MAN_SPRITE = "assets/images/man.png";

STUPID_SPRITE = "assets/images/stupid.png";

man = null;

ledges = null;

stars = null;

scoreText = null;

score = 0;

velocity = 150;

initGame = function() {
  return game = window.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "", {
    preload: preload,
    create: create,
    update: update
  });
};

preload = function() {
  game.load.onFileComplete.add(function() {
    return console.log('Loading..', game.load.progress);
  });
  game.load.image("star", "assets/images/star.png");
  game.load.spritesheet("man", MAN_SPRITE, 32, 48);
  game.load.image("sky", "assets/images/sky.png");
  game.load.image("ground", "assets/images/ground.png");
  game.load.image("stupid", STUPID_SPRITE);
  return game.load.image("diamond", "assets/images/diamond.png");
};

create = function() {
  addBackground();
  makePhysicsWorld();
  makeLedge();
  makeMan();
  makeStars();
  makeScore();
  makeButtons();
  return listenTouch();
};

makePhysicsWorld = function() {
  return game.physics.startSystem(Phaser.Physics.ARCADE);
};

makeMan = function() {
  man = game.add.sprite(WIDTH / 2, HEIGHT / 2, 'man');
  man.anchor.setTo(0.5, 0.5);
  game.physics.arcade.enable(man);
  man.body.collideWorldBounds = true;
  man.body.gravity.y = 1000;
  man.frame = 4;
  man.animations.add("left", [0, 1, 2, 3], 10, true);
  return man.animations.add("right", [5, 6, 7, 8], 10, true);
};

makeStars = function() {
  var i, star, _i, _ref1, _results;
  stars = game.add.group();
  stars.enableBody = true;
  _results = [];
  for (i = _i = 0, _ref1 = (WIDTH - 10) / 40; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
    star = stars.create(5 + i * 40, 20, "star");
    star.body.gravity.y = 100;
    _results.push(star.body.bounce.y = 0.7 + Math.random() * 0.2);
  }
  return _results;
};

makeScore = function() {
  return scoreText = game.add.text(16, 16, "Score: 0", {
    font: "bold 20px Arial",
    fill: "red"
  });
};

makeLedge = function() {
  var ground, groundHeight, led, ledge, leds, _i, _len, _results;
  ledges = game.add.group();
  ledges.enableBody = true;
  groundHeight = 50;
  ground = ledges.create(0, HEIGHT - groundHeight, 'ground');
  ground.scale.setTo(WIDTH / 400, HEIGHT / 32);
  ground.body.immovable = true;
  leds = [
    {
      x: 0,
      y: HEIGHT - 150,
      width: 100,
      height: 20
    }, {
      x: WIDTH - 130,
      y: HEIGHT - 240,
      width: 130,
      height: 20
    }, {
      x: 0,
      y: HEIGHT - 340,
      width: 100,
      height: 20
    }
  ];
  _results = [];
  for (_i = 0, _len = leds.length; _i < _len; _i++) {
    led = leds[_i];
    ledge = ledges.create(led.x, led.y, 'ground');
    ledge.scale.setTo(led.width / 400, led.height / 32);
    _results.push(ledge.body.immovable = true);
  }
  return _results;
};

addBackground = function() {
  return game.add.sprite(0, 0, 'sky');
};

update = function() {
  game.physics.arcade.collide(man, ledges);
  game.physics.arcade.collide(stars, ledges);
  game.physics.arcade.overlap(man, stars, function(man, star) {
    score += 10;
    scoreText.text = "Score: " + score;
    return star.kill();
  });
  return listenAndMakeManMove();
};

listenAndMakeManMove = function() {
  var keyboard;
  keyboard = game.input.keyboard;
  man.body.velocity.x = 0;
  if ((keyboard.isDown(A_KEY)) || isTouchLeft()) {
    runLeft();
  } else if ((keyboard.isDown(D_KEY)) || isTouchRight()) {
    runRight();
  } else {
    man.animations.stop();
    if (man.isLeft) {
      man.frame = 0;
    } else {
      man.frame = 5;
    }
  }
  if (man.body.touching.down && (isJump || (keyboard.isDown(J_KEY)))) {
    return jump();
  }
};

isTouchRight = function() {
  return direct === 'right';
};

isTouchLeft = function() {
  return direct === 'left';
};

direct = null;

isJump = false;

listenTouch = function() {
  return game.input.onUp.add(function(event) {
    direct = null;
    return isJump = false;
  });
};

runLeft = function() {
  man.body.velocity.x = -velocity;
  man.animations.play("left");
  return man.isLeft = true;
};

runRight = function() {
  man.body.velocity.x = velocity;
  man.animations.play("right");
  return man.isLeft = false;
};

jump = function() {
  return man.body.velocity.y = -500;
};

makeButtons = function() {
  var jumpBtn, left, right;
  left = game.add.button(16, HEIGHT - 50, "diamond");
  right = game.add.button(60, HEIGHT - 50, "diamond");
  jumpBtn = game.add.button(WIDTH - 16 - 32, HEIGHT - 50, "diamond");
  left.onInputDown.add(function(event) {
    return direct = 'left';
  });
  left.onInputOut.add(function(event) {
    return direct = null;
  });
  right.onInputDown.add(function() {
    return direct = 'right';
  });
  right.onInputOut.add(function(event) {
    return direct = null;
  });
  jumpBtn.onInputDown.add(function() {
    return isJump = true;
  });
  jumpBtn.onInputOut.add(function(event) {
    return isJump = false;
  });
  right.onInputOut.add(function(event) {});
  return window.left = left;
};

initGame();



},{"./constants.coffee":1,"./init.coffee":2}]},{},[3]);