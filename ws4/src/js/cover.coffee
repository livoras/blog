cover = {}
canvas = null
ctx = null

currentImg = nextImg = null
slideData = require "./slide-data.coffee"
PACE = slideData.OPACITY_PACE
opacity = 0
isChange = no
util = require "./util.coffee"
clip = util.clip
$ = util.$
imgData = null

x = y = width = height = 0
gradientHeight = 90

$textWrapper = $ "div.text-wrapper"
$title = $ "div.title"
$text = $ "div.text"

cover.change = (img)->
    imgData = img
    nextImg = img.data
    opacity =   0
    isChange = yes
    updateText()

cover.move = ->
    if isChange
        opacity += PACE
        renderCurrentImage()
        renderNextImage()
        if opacity >= 1
            isChange = no
            opacity = 0
            currentImg = nextImg
    else
        drawCurrentImage()

    drawText()

renderNextImage = ->
    if not currentImg then return
    ctx.save()
    ctx.globalAlpha = opacity
    draw nextImg
    ctx.restore()

renderCurrentImage = ->    
    if not currentImg then return
    ctx.save()
    ctx.globalAlpha = 1 - opacity
    draw currentImg
    ctx.restore()

drawCurrentImage = ->
    if not currentImg or isChange then return
    ctx.save()
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 3
    ctx.shadowColor = "#000"
    draw currentImg
    ctx.restore()

draw = (img)->
    ctx.translate x, y
    {sx, sy, sw, sh} = clip img, width, height
    ctx.drawImage img, sx, sy, sw, sh, 0, 0, width, height

drawText = ->
    if not imgData then return
    drawShadow()

drawShadow = ->    
    ctx.save()
    gradient = ctx.createLinearGradient canvas.width / 2,  y + height, canvas.width / 2, y + height - gradientHeight
    gradient.addColorStop 0, "rgba(0, 0, 0, 0.9)"
    gradient.addColorStop 1, "rgba(0, 0, 0, 0)"
    ctx.fillStyle = gradient
    ctx.fillRect x, y + height - gradientHeight, width, gradientHeight
    ctx.restore()

cover.init = (cvs)->
    canvas = cvs
    ctx = canvas.getContext "2d"
    width = slideData.coverWidth
    height = slideData.coverHeight
    x = slideData.coverX
    y = slideData.coverY
    initText()
    initEvent()

initText = ->
    $textWrapper.style.width = width + 'px'
    $textWrapper.style.top = y + height - gradientHeight + 5 + 'px'

initEvent = ->
    px = 0
    py = 0
    touch = (event)->
        event.preventDefault()
        if not imgData then return
        touch = event.touches[0];
        px = touch.pageX
        py = touch.pageY
    window.addEventListener "touchstart", touch
    window.addEventListener "touchmove", touch
    window.addEventListener "touchend", (event)->
        if px > x and px < x + width and py > y and py < y + height
            window.location.href = imgData.target

updateText = ->
    $title.innerHTML = imgData.title
    $text.innerHTML = imgData.text

module.exports = cover   