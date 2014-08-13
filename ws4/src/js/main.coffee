data = require "./data.json"
util = require "./util.coffee"
world = require "./world.coffee"
cover = require "./cover.coffee"
background = require "./background.coffee"
images = data.images 
dashboard = require "./dashboard.coffee"
actions = require "./actions.coffee"

{$, Iterator, addClass, removeClass, setBackground, setRotate} = util

canvas = $ "#canvas"
canvasBack = $ "#canvas-back"
ctx = canvas.getContext "2d"

resizeCanvas = ->
    canvas.height = window.outerHeight
    canvas.width = window.outerWidth
    canvasBack.height = window.outerHeight
    canvasBack.width = window.outerWidth

init = ->
    resizeCanvas()
    initImages ->
        initBackground()
        initDashboard()
        initCover()
        initActions()
        world.start()

initBackground = ->
    background.init canvas, canvasBack
    world.add background

initCover = ->
    cover.init canvas
    world.add cover

initActions = ->
    actions.actionLeft = -> dashboard.prev()
    actions.actionRight = -> dashboard.next()
    actions.init canvas
    world.add actions

initImages = (callback)->
    count = 0
    check = ->
        count++
        if count is images.length then callback()

    for img, i in images
        data = new Image
        data.addEventListener "load", ->
            check()
        img.data = data
        data.src = img.url

initDashboard = ->
    dashboard.init canvas, world
    dashboard.onActive = (imgData)->
        background.change imgData.data
        cover.change imgData
    dashboard.next()
    background.changeFront dashboard.activeImageData.data

init()
