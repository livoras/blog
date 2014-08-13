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
