slideData = require "./slide-data.coffee"
util = require "./util.coffee"
ctx = null
canvas = null
radius = slideData.radius
{clip} = util

class Thumb
    constructor: (@originX, @originY, @angle, @img)->
        @targetAngle = @angle
        @width = slideData.THUMB_WIDTH
        @height = slideData.THUMB_HEIGHT
        @isAnima = yes

    move: ->
        @updateAngle()
        ctx.save()
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 1
        ctx.shadowColor = "#555"
        ctx.translate @originX, @originY
        ctx.rotate @angle / 180 * Math.PI


        {sx, sy, sw, sh} = clip @img.data, @width, @height
        ctx.drawImage @img.data, sx, sy, sw, sh, -@width / 2, -(radius + @height), @width, @height

        if @isActive
            ctx.globalAlpha = 0.5
            ctx.fillStyle = "#000000"
            ctx.fillRect -@width / 2, -(radius + @height), @width, @height

        ctx.restore()

    change: (angle, callback)->    
        if @isAnima 
            @animChange angle, callback
        else
            @angle = @targetAngle = angle

    animChange: (angle, callback)->
        @isAnima = yes
        @targetAngle = angle
        @pace = (angle - @angle) / 20
        @callback = callback

    updateAngle: ->
        if @angle is @targetAngle then return
        if Math.abs(@targetAngle - @angle) < 0.5
            @angle = @targetAngle
            @callback?()
        else
            @angle += @pace

    active: ->
        @isActive = yes

    deactive: ->
        @isActive = no 

Thumb.init = (cvs)->
    canvas = cvs
    ctx = canvas.getContext "2d"


module.exports = Thumb