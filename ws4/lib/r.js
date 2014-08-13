var r = {}

r.images = {
    pool: {},
    count: 0,
    loadedCount: 0
}

r.images.set = function(id, src, callback) {
    var img = new Image
    if (r.images.pool[id]) {
        throw new Error("id " + id + " existed.")
    }
    img.addEventListener("load", function() {
        img.isLoaded = true
        if (typeof callback === "function") {
            callback(img)
            r.emit("image loaded", img)
        }

        r.images.loadedCount++
        if (r.images.loadedCount === r.images.count) {
            r.emit("all images loaded")
        }
    })
    img.src = src
    r.images.pool[id] = img
    r.images.count++
    return img
}

r.images.get = function(id) {
    return r.images.pool[id]
}

module.exports = r
