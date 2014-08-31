gestureEvent = require "./gesture-event.coffee"
CURRENT_Z_INDEX = 100
HEIGHT = window.innerHeight
WIDTH = window.innerWidth
GAP = 0.33 * HEIGHT

class FancySlide extends LA.SlideController
    constructor: ->
        @$progress = $ "<ul id='slide-progress'></ul>"
        $("div.wrapper").append @$progress
        @curr = null
        @prev = null
        @next = null
        @prevTimeline = null
        @nextTimeline = null
        @able = no
        @isLoop = yes
        @isReachEnd = no
        @isFirstSetCurr = yes
        @isProgressShow = yes
        @ease = Linear.easeNone
        @prevState = {autoAlpha: 0, rotationZ: 90, y: -HEIGHT, ease: @ease}
        @currState = {autoAlpha: 1, rotationZ: 0, y: 0, ease: @ease}
        @nextState = {autoAlpha: 0, rotationZ: 0, y: HEIGHT, ease: @ease}
        @duration = 0.5
    initStates: (prevState, currState, nextState)->
        if prevState then @prevState = prevState
        if currState then @currState = currState
        if nextState then @nextState = nextState
        if not @prevState.ease then @prevState.ease = @ease
        if not @currState.ease then @currState.ease = @ease
        if not @nextState.ease then @nextState.ease = @ease
    init: (pages)->
        @pages = pages
        @pages.forEach (page, i)=>
            page.$container.hide()
            page.pageIndex = i 
            @$progress.append ($ "<li id='progress-#{i}'></li>")
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
    showProgress: ->
        @isProgressShow = yes
        @$progress.show()
    hideProgress: ->
        @isProgressShow = no
        @$progress.hide()
    setDuration: (duration)->
        @duration = duration or @duration
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
        if @isProgressShow then @_activeProgressByIndex page.pageIndex
        if page.pageIndex is @pages.length - 1 then @isReachEnd = yes
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
            return if @isLoop and @isReachEnd then @pages[@pages.length - 1] else null
    _getNextByIndex: (index)->
        nextIndex = index + 1
        if nextIndex < @pages.length
            return @pages[nextIndex]
        else
            return if @isLoop then @pages[0] else null
    _remakeTimelines: ->
        if @next
            ntl = @nextTimeline = new TimelineMax
            ntl.to @curr.$container, @duration, @prevState, "next"
               .to @next.$container, @duration, @currState, "next"
               # .call => @_makePageCurrent @next
            ntl.pause()
        if @prev
            ptl = @prevTimeline = new TimelineMax
            ptl.to @curr.$container, @duration, @nextState, "prev"
               .to @prev.$container, @duration, @currState, "prev"
               # .call => @_makePageCurrent @prev
            ptl.pause()
    _initEvents: ->
        gestureEvent.on "swiping up", (dist)=>
            if not @able then return
            if not @next or not @nextTimeline then return
            if @_isTimelineActive() then return
            @nextTimeline.pause()
            @nextTimeline.progress dist / HEIGHT
        gestureEvent.on "swipe up", (dist, v)=>
            if not @able then return
            if not @next or not @nextTimeline then return
            if @_isTimelineActive() then return
            @_enableAnimation()
            isRun = no
            setTimeout =>
                @_disableAnimation()
                if isRun then @_makePageCurrent @next
            , @duration * 1000
            if dist > GAP or v > 1 
                isRun = yes
                @nextTimeline.progress 100
            else
                @nextTimeline.progress 0

        gestureEvent.on "swiping down", (dist)=>
            if not @able then return
            if not @prev or not @prevTimeline then return
            if @_isTimelineActive() then return
            @prevTimeline.pause()
            @prevTimeline.progress dist / HEIGHT
        gestureEvent.on "swipe down", (dist, v)=>
            if not @able then return
            if not @prev or not @prevTimeline then return
            if @_isTimelineActive() then return
            @_enableAnimation()
            isRun = no
            setTimeout =>
                @_disableAnimation()
                if isRun then @_makePageCurrent @prev
            , @duration * 1000
            if dist > GAP or v > 1 
                isRun = yes
                @prevTimeline.progress 100
            else
                @prevTimeline.progress 0

    _activeProgressByIndex: (index)->            
        $("#slide-progress li.active").removeClass "active"
        $("#progress-#{index}").addClass "active"

    _isTimelineActive: ()->
        if @nextTimeline and @nextTimeline.isActive() then return yes
        if @prevTimeline and @prevTimeline.isActive() then return yes

    _enableAnimation: ->    
        if @curr then @curr.$container.addClass "transition"
        if @prev then @prev.$container.addClass "transition"
        if @next then @next.$container.addClass "transition"

    _disableAnimation: ->    
        if @curr then @curr.$container.removeClass "transition"
        if @prev then @prev.$container.removeClass "transition"
        if @next then @next.$container.removeClass "transition"

LA.util.exports FancySlide
module.exports = FancySlide
