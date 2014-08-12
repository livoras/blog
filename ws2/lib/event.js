var util = require("./util")
var EventEmitter = require("eventemitter2").EventEmitter2

EventEmitter.extend = util.extend

module.exports = EventEmitter
