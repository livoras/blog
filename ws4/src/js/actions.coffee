slideData = require "./slide-data.coffee"
canvas = null
ctx = null

left = new Image
left.src = "img/left.png"

right = new Image
right.src = "img/right.png"

cy = slideData.coverY
cx = slideData.coverX
ch = slideData.coverHeight
cw = slideData.coverWidth

GAP = 25
WIDTH = 23
HEIGHT = 60
actions = {}

leftOrd = 
    x: cx - WIDTH - GAP
    y: cy + (ch - HEIGHT) / 2

rightOrd = 
    x: cx + cw + GAP
    y: cy + (ch - HEIGHT) / 2

actions.init = (csv)->
    canvas = csv
    ctx = canvas.getContext "2d"
    initEvents()

actions.move = ->
    renderLeft()
    renderRight()

renderRight = ->
    x = cx + cw + GAP
    y = cy + (ch - HEIGHT) / 2
    ctx.save()
    ctx.drawImage right, rightOrd.x, rightOrd.y, WIDTH, HEIGHT 
    ctx.restore()

renderLeft = ->    
    x = cx - WIDTH - GAP
    y = cy + (ch - HEIGHT) / 2
    ctx.save()
    ctx.drawImage left, leftOrd.x, leftOrd.y, WIDTH, HEIGHT 
    ctx.restore()

initEvents = ->
    window.addEventListener "touchstart", (event)->
        event.preventDefault()
        touch = event.touches[0];

        x = touch.pageX
        y = touch.pageY

        if x > leftOrd.x and 
           x < leftOrd.x + WIDTH and
           y > leftOrd.y and
           y < leftOrd.y + HEIGHT then actions.actionLeft()

        if x > rightOrd.x and 
           x < rightOrd.x + WIDTH and
           y > rightOrd.y and
           y < rightOrd.y + HEIGHT then actions.actionRight()

actions.actionRight = -> 

actions.actionLeft = -> 

module.exports = actions
