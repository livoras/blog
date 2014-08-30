# {$, log} = LA.util
# MAX_Z_INDEX = 1000
# CONTENT_HEIGHT = window.innerHeight
# CONTENT_WIDTH = window.innerWidth
# $window = $ document.body

# startY = 0
# endY = 0
# dist = 0

# DURATION = 0.5
# currentIndex = 0
# prevIndex = 0
# nextIndex = 0

# class Slide extends LA.SlideController
#     constructor: ->
#         @curr = null
#         @prev = null
#         @next = null
#         @able = no
#         @isSwitching = no
#         @isReachEnd = no
#         @isFirstSetCurr = yes
#         @startSlide = no

#     init: (pages)->
#         @pages = pages
#         pages.forEach (page, i)->
#             page.$container.css "zIndex", MAX_Z_INDEX - i
#         currentIndex = 0
#         nextIndex = 1
#         prevIndex = -1
#         @_update()
#         @_initEvents()

#     enable: ->
#         @able = yes

#     disable: ->
#         @able = no

#     _initEvents: ->
#         $window.on "touchstart", (event)=>
#             @startSlide = yes
#             startY = event.clientY or event.touches[0].clientY
#         $window.on "touchmove", (event)=>
#             if not @startSlide then return
#             endY = event.clientY or event.touches[0].clientY
#             dist = endY - startY
#             if currentIndex is 0
#                 if dist > 0 and not @isReachEnd then return
#             if @able and not @isSwitching then @_slide()
#         $window.on "touchend", =>
#             if not @able then return
#             if @_isReadyToSwitch()
#                 if dist < 0
#                     @_switchUp()
#                 else
#                     if currentIndex is 0 and not @isReachEnd then return
#                     @_switchDown()
#             else
#                 @_back()
#             @startSlide = no

#     _slide: ->        
#         if dist < 0
#             TweenMax.set @currPage.$container, {"y": dist}
#             TweenMax.set @nextPage.$container, {"y": CONTENT_HEIGHT + dist}
#         if dist > 0
#             if not @prevPage then return
#             TweenMax.set @currPage.$container, {"y": dist}
#             TweenMax.set @prevPage.$container, {"y": -CONTENT_HEIGHT + dist}

#     _switchUp: ->
#         @isSwitching = yes
#         count = 0
#         check = => 
#             if ++count is 2
#                 @emit "deactive", @currPage
#                 @_next()
#                 @isSwitching = no
#         TweenMax.to @currPage.$container, DURATION, {"y": -CONTENT_HEIGHT, onComplete: check}
#         TweenMax.to @nextPage.$container, DURATION, {"y": 0, onComplete: check}

#     _switchDown: ->
#         @isSwitching = yes
#         count = 0
#         check = => 
#             if ++count is 2
#                 @emit "deactive", @currPage
#                 @_prev()
#                 @isSwitching = no
#         TweenMax.to @currPage.$container, DURATION, {"y": CONTENT_HEIGHT, onComplete: check}
#         TweenMax.to @prevPage.$container, DURATION, {"y": 0, onComplete: check}

#     _setNext: (page)->
#         if not page then return
#         @nextPage = page
#         TweenMax.set page.$container, {"y": CONTENT_HEIGHT}

#     _setCurr: (page)->    
#         if not page then return
#         @currPage = page
#         TweenMax.set page.$container, {"y": 0}
#         active = => @emit "active", page
#         if @isFirstSetCurr
#             @isFirstSetCurr = no
#             LA.core.on "cover done", active
#             return
#         active()

#     _setPrev: (page)->    
#         if not page then return
#         @prevPage = page
#         TweenMax.set page.$container, {"y": -CONTENT_HEIGHT}

#     _isReadyToSwitch: ->    
#         Math.abs(dist) > 50

#     _back: ->
#         time = 0.3
#         if @currPage then TweenMax.to @currPage.$container, time, {"y": 0}
#         if @prevPage then TweenMax.to @prevPage.$container, time, {"y": -CONTENT_HEIGHT}
#         if @nextPage then TweenMax.to @nextPage.$container, time, {"y": CONTENT_HEIGHT}

#     _next: ->
#         prevIndex = currentIndex
#         currentIndex = nextIndex
#         nextIndex = if currentIndex + 1 is @pages.length then 0 else currentIndex + 1
#         @_update()

#     _prev: ->
#         nextIndex = currentIndex
#         currentIndex = prevIndex
#         prevIndex = if currentIndex - 1 is -1 then @pages.length - 1 else currentIndex - 1
#         @_update()

#     _update: ->
#         MAX_Z_INDEX += 4
#         @_setCurr @pages[currentIndex]
#         @_setPrev @pages[prevIndex]
#         @_setNext @pages[nextIndex]
#         if currentIndex is @pages.length - 1 then @isReachEnd = yes
#         if @prevPage then @prevPage.$container.css "zIndex", MAX_Z_INDEX - 2
#         if @currPage then @currPage.$container.css "zIndex", MAX_Z_INDEX - 1
#         if @nextPage then @nextPage.$container.css "zIndex", MAX_Z_INDEX

gestureEvent = require "./gesture-event.coffee"
# gestureEvent.on "swipe up", (dist, v)-> console.log 'up', v
# gestureEvent.on "swipe down", (dist, v)-> console.log 'down', v
# gestureEvent.on "swiping up", (dist)-> console.log 'uping', dist
# gestureEvent.on "swiping down", (dist)-> console.log 'downing', dist

CURRENT_Z_INDEX = 100
HEIGHT = window.innerHeight
WIDTH = window.innerWidth
DURATION = 0.3
GAP = HEIGHT * 0.3

class FancySlide extends LA.SlideController
    constructor: ->
        @curr = null
        @prev = null
        @next = null
        @prevTimeline = null
        @nextTimeline = null
        @able = no
        @isLoop = no
        @initStatus()
        @isFirstSetCurr = yes
    initStatus: (prevState, currState, nextState)->
        # @prevState = prevState or {autoAlpha: 1, y: -HEIGHT}
        # @currState = currState or {autoAlpha: 1, y: 0}
        # @nextState = nextState or {autoAlpha: 1, y: HEIGHT}
        SCALE = 0.6
        @prevState = prevState or {autoAlpha: 0, scaleX: SCALE, scaleY: SCALE, transformOrigin: "50% 50%"}
        @currState = currState or {autoAlpha: 1, y: 0, scaleX: 1, scaleY: 1, transformOrigin: "50% 50%"}
        @nextState = nextState or {autoAlpha: 0, y: HEIGHT}
    init: (pages)->
        @pages = pages
        @pages.forEach (page, i)->
            page.$container.hide()
            page.pageIndex = i 
        @_makePageCurrent pages[0]
        @_initEvents()
    enable: ->
        @able = yes
    disable: ->
        @able = no
    loop: ->
        @isLoop = yes
    unloop: ->
        @isLoop = no
    showProcess: ->
    hideProcess: ->
    _makePageCurrent: (page)->
        prev = @_getPrevByIndex page.pageIndex
        next = @_getNextByIndex page.pageIndex
        if @prev then @prev.$container.hide()
        @_setCurr page
        @_setPrev prev
        @_setNext next
        if @next then @next.$container.show()
        @_remakeTimelines()
    _setCurr: (page)->
        @curr = page
        $container = page.$container
        $container.show()
        $container.css "zIndex", CURRENT_Z_INDEX
        TweenMax.set $container, @currState
        if @isFirstSetCurr then return @isFirstSetCurr = no
        @emit "active", page
    _setNext: (page)->
        @next = page
        if not @next then return
        $container = page.$container
        $container.show()
        $container.css "zIndex", CURRENT_Z_INDEX + 1
        TweenMax.set $container[0], @nextState
        @emit "deactive", page
    _setPrev: (page)->
        @prev = page
        if not @prev then return
        $container = page.$container
        $container.show()
        $container.css "zIndex", CURRENT_Z_INDEX - 1
        TweenMax.set $container, @prevState
        @emit "deactive", page
    _getPrevByIndex: (index)->
        prevIndex = index - 1
        if prevIndex >= 0 
            return @pages[prevIndex]
        else
            return if @isLoop then @pages[@pages.length - 1] else null
    _getNextByIndex: (index)->
        nextIndex = index + 1
        if nextIndex < @pages.length
            return @pages[nextIndex]
        else
            return if @isLoop then @pages[0] else null
    _remakeTimelines: ->
        if @next
            ntl = @nextTimeline = new TimelineMax
            ntl.to @curr.$container, DURATION, @prevState, "next"
               .to @next.$container, DURATION, @currState, "next"
               .call => @_makePageCurrent @next
            ntl.pause()
        if @prev
            ptl = @prevTimeline = new TimelineMax
            ptl.to @curr.$container, DURATION, @nextState, "prev"
               .to @prev.$container, DURATION, @currState, "prev"
               .call => @_makePageCurrent @prev
            ptl.pause()
    _initEvents: ->
        gestureEvent.on "swiping up", (dist)=>
            if not @next or not @nextTimeline then return
            if @nextTimeline.isActive() then return
            @nextTimeline.pause()
            @nextTimeline.progress dist / HEIGHT
        gestureEvent.on "swipe up", (dist, v)=>
            if not @next or not @nextTimeline then return
            if @nextTimeline.isActive() then return
            @nextTimeline.resume()
            if dist > GAP or v > 1 
                @nextTimeline.play()
            else
                @nextTimeline.reverse()

        gestureEvent.on "swiping down", (dist)=>
            if not @prev or not @prevTimeline then return
            if @prevTimeline.isActive() then return
            @prevTimeline.pause()
            @prevTimeline.progress dist / HEIGHT
        gestureEvent.on "swipe down", (dist, v)=>
            if not @prev or not @prevTimeline then return
            if @prevTimeline.isActive() then return
            @prevTimeline.resume()
            if dist > GAP or v > 1 
                @prevTimeline.play()
            else
                @prevTimeline.reverse()


LA.util.exports FancySlide
module.exports = FancySlide
