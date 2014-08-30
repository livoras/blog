gestureEvent = new EventEmitter2
$window = $ window

currentPos = null
startPos = null
startTime = null

$window.on "touchstart", (event)->
    startTime = +new Date
    startPos = currentPos = pos = getPos event
    gestureEvent.emit "touchstart", currentPos

$window.on "touchmove", (event)->
    currentPos = pos = getPos event
    gestureEvent.emit "touchstart", currentPos

    distY = currentPos.y - startPos.y
    absDistY = Math.abs distY
    if distY < 0 then gestureEvent.emit "swiping up", absDistY
    else gestureEvent.emit "swiping down", absDistY

$window.on "touchend", (event)->
    gestureEvent.emit "touchend", currentPos
    currentTime = +new Date
    distTime = currentTime - startTime
    distY = currentPos.y - startPos.y
    absDistY = Math.abs(distY)
    velocity = absDistY / distTime
    if distY < 0 then gestureEvent.emit "swipe up", absDistY, velocity 
    else gestureEvent.emit "swipe down", absDistY, velocity 

getPos = (event)->
    x = event.clientX or event.touches[0].clientX
    y = event.clientY or event.touches[0].clientY
    {x, y}

module.exports = gestureEvent
