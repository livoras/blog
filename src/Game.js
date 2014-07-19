"use strict";

(function(exports, undefined) {

    var ns = exports.Best = exports.Best || {};

    var Game = ns.Game = function(options) {
        for (var p in options) {
            this[p] = options[p]
        }
    };

    Game.prototype = {
        constructor: Game,
        id: null,
        FPS: 60,
        init: function() {
            var Me = this;
            this._run = function() {
                Me.run();
            };
            this.timer = {
                now: 0,
                last: 0,
                step: Math.round(1000 / this.FPS)
            };
            if (this.onInit) {
                this.onInit.apply(this, arguments);
            }
        },

        start: function() {
            this.timer.now = Date.now();
            this.timer.last = Date.now();
            this.paused = false;
            this.running = true;
            if (this.onStart) {
                this.onStart();
            }
            this.run();
        },
        pause: function() {
            this.paused = true;
            if (this.onPause) {
                this.onPause();
            }
        },
        resume: function() {
            this.paused = false;
            if (this.onResume) {
                this.onResume();
            }
        },
        stop: function() {
            this.running = false;
            if (this.onStop) {
                this.onStop();
            }
        },
        run: function() {
            var now = this.timer.now = Date.now();
            var timeStep = now - this.timer.last;
            this.timer.last = now;
            this.loopId = setTimeout(this._run, this.timer.step);
            this.handleInput(timeStep, now);
            if (!this.paused && timeStep > 1) {
                this.update(timeStep, now);
                this.render(timeStep, now);
            }
            if (!this.running) {
                clearTimeout(this.loopId);
            }
        },
        update: function(timeStep, now) {
            // implement by yourself
        },
        render: function(timeStep, now) {
            // implement by yourself
        },
        handleInput: function(timeStep, now) {
            // implement by yourself
        },
        // some hooks, implement by yourself
        onInit: null,
        onStart: null,
        onPause: null,
        onResume: null,
        onStop: null,

    };

})(this);
