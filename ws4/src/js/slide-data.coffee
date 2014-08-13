THUMB_HEIGHT = 96
THUMB_WIDTH = 65
canvasHeight = window.outerHeight
canvasWidth = window.outerWidth
DASHBOARD_WIDTH = canvasWidth
DASHBOARD_HEIGHT = 175

init = ->
    rh = DASHBOARD_HEIGHT - THUMB_HEIGHT
    rw = DASHBOARD_WIDTH / 2
    radius = 0.5 * (rw * rw + rh * rh) / rh

    l = rw * 2
    w = THUMB_WIDTH * 2
    r = radius
    perPI = Math.atan 0.5 * w / r
    perDeg = piToDeg perPI

    totalPI = 2 * Math.asin 0.5 * l / r
    totalDeg = piToDeg totalPI

    visibleImgsCount = Math.round totalPI / perPI
    if visibleImgsCount % 2 is 0 then visibleImgsCount++

    imgLoops = [0]
    half = (visibleImgsCount - 1) / 2
    for i in [1..half]
        imgLoops.push i * perDeg
        imgLoops.unshift -i * perDeg

    exports.degs = imgLoops
    exports.totalDeg = totalDeg
    exports.perDeg = perDeg
    exports.visibleImgsCount = visibleImgsCount
    exports.originX = DASHBOARD_WIDTH / 2
    exports.originY = canvasHeight + radius - DASHBOARD_HEIGHT + THUMB_HEIGHT
    exports.radius = radius

    exports.THUMB_WIDTH = THUMB_WIDTH
    exports.THUMB_HEIGHT = THUMB_HEIGHT
    exports.DASHBOARD_HEIGHT = DASHBOARD_HEIGHT
    exports.DASHBOARD_WIDTH = DASHBOARD_WIDTH
    exports.OPACITY_PACE = 0.05

    exports.coverWidth = canvasWidth * 0.6
    exports.coverHeight = canvasHeight * 0.53
    exports.coverX = (canvasWidth - exports.coverWidth) / 2
    exports.coverY = canvasHeight - DASHBOARD_HEIGHT - exports.coverHeight - 25

piToDeg = (pi)->        
    pi / Math.PI * 180


init()