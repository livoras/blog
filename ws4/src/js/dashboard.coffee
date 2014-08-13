data = require "./data.json"
images = data.images 
slideData = require "./slide-data.coffee"
util = require "./util.coffee"
Thumb = require "./thumb.coffee"
thumbs = []
headIter = null
tailIter = null
world = null
isSliding = no
currentActive = null

{$, Iterator, addClass, removeClass, setBackground, setRotate} = util
{originX, originY, degs, visibleImgsCount} = slideData

dashboard = {}

dashboard.init = (canvas, w)->
    Thumb.init canvas
    world = w
    makeSlideShow()
    iniSlideAction()

dashboard.next = next = ->
    if isSliding then return
    slideForward()

dashboard.prev = prev = ->    
    if isSliding then return
    slideBackward()

makeSlideShow = ->
    imgIter = new util.Iterator images, yes
    headIter = new util.Iterator images, yes

    for deg, i in degs
        img = imgIter.current()
        index = imgIter.index
        imgIter.next()
        thumb = new Thumb originX, originY, deg, img
        thumb.imgIndex = index
        thumbs.push thumb
        world.add thumb

    currentActive = thumbs[(visibleImgsCount - 1) / 2]
    tailIter = imgIter
    tailIter.prev()

slideForward = ->    
    isSliding = yes
    deactive currentActive
    thumb = thumbs.shift()
    headIter.next()
    imgData = tailIter.next()
    thumbs.push thumb
    processSlide thumb, imgData
    currentActive = thumbs[(visibleImgsCount - 1) / 2]
    active currentActive
    nextImgIndex = currentActive.imgIndex
    activeImageData = images[nextImgIndex]
    dashboard.activeImageData = activeImageData
    dashboard.onActive activeImageData
    
slideBackward = ->    
    isSliding = yes
    deactive currentActive
    thumb = thumbs.pop()
    tailIter.prev()
    imgData = headIter.prev()
    thumbs.unshift thumb
    processSlide thumb, imgData
    currentActive = thumbs[(visibleImgsCount - 1) / 2]
    active currentActive
    nextImgIndex = currentActive.imgIndex
    activeImageData = images[nextImgIndex]
    dashboard.activeImageData = activeImageData
    dashboard.onActive activeImageData

processSlide = (thumb)->   
    thumb.isAnima = no
    resetRotate -> 
        isSliding = no
        thumb.isAnima = yes

resetRotate = (callback)->
    count = 0
    cb = ->
        count++
        if count is thumbs.length - 1 then callback()
    for thumb, i in thumbs
        thumb.change degs[i], cb

deactive = (thumb)->
    thumb.deactive()

active = (thumb)->    
    thumb.active()

iniSlideAction = ->
    currentPageX = originPageX = 0
    THRESHOLD = 50
    isActive = no

    window.addEventListener "touchstart", (event)->
        event.preventDefault()
        touch = event.touches[0];
        if touch.pageY >= canvas.height - slideData.DASHBOARD_HEIGHT
            isActive = yes
        else 
            isActive = no
        currentPageX = originPageX = touch.pageX

    window.addEventListener "touchmove", (event)->
        if not isActive then return
        event.preventDefault()
        touch = event.touches[0];
        currentPageX = touch.pageX

    window.addEventListener "touchend", (event)->
        if not isActive then return
        event.preventDefault()
        if currentPageX > originPageX and currentPageX - originPageX > THRESHOLD
            prev()
        else if originPageX > currentPageX and originPageX - currentPageX > THRESHOLD
            next()


dashboard.onActive = (img)->
    console.log "TOBE IMPLEMENTED."

module.exports = dashboard