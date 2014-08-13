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
