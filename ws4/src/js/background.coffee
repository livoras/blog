blur = require "./blur.coffee"
util = require "./util.coffee"
slideData = require "./slide-data.coffee"
background = {}
imgDataDrawer = null
ctx = null
canvas = null

front = null
back = null

param = 0
isChange = no
canvasBack = null
PACE = slideData.OPACITY_PACE

clip = util.clip

callback = ->

background.move = ->
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if isChange
        changeFront()
        changeBack()
        param += PACE
        if param > 1
            isChange = no
            param = 0
            front = back
            callback?()
    else
        renderFront()

renderFront = ->
    if not front then return
    ctx.save()
    ctx.globalAlpha = 1
    if front.imgData
        ctx.drawImage front.imgData, 0, 0
    ctx.restore()

changeFront = ->
    if not front then return
    ctx.save()
    ctx.globalAlpha = 1 - param
    ctx.drawImage front.imgData, 0, 0
    ctx.restore()

changeBack = ->
    if not back then return
    ctx.save()
    ctx.globalAlpha = param
    ctx.drawImage back.imgData, 0, 0
    ctx.restore()

background.init = (cvs, cvsb)->
    canvas = cvs
    canvasBack = cvsb
    ctx = canvas.getContext "2d"
    imgDataDrawer = cvsb.getContext "2d"

background.change = (img, cb)->
    img.imgData = getRenderData img
    isChange = yes
    back = img
    callback = cb

background.changeFront = (img)->
    front = img
    img.imgData = getRenderData img

getRenderData = (img)->    
    w = canvas.width
    h = canvas.height
    {sx, sy} = clip img, w, h
    imgDataDrawer.drawImage img, sx, sy, w, h, 0, 0, w, h
    imgData = imgDataDrawer.getImageData 0, 0, w, h
    blur imgData
    imgDataDrawer.putImageData imgData, 0, 0
    newImg = new Image
    newImg.src = canvasBack.toDataURL()
    newImg

module.exports = background