gestureEvent = require "./gesture-event.coffee"
CURRENT_Z_INDEX = 100
HEIGHT = window.innerHeight
WIDTH = window.innerWidth
GAP = 0.3 * HEIGHT

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
        @prevState = {y: -HEIGHT, ease: @ease}
        @currState = {y: 0, ease: @ease}
        @nextState = {y: HEIGHT, ease: @ease}
        @duration = 1
        @isAnimating = no
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
        TweenLite.set $container, @currState
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
        TweenLite.set $container[0], @nextState
        @emit "deactive", page
    _setPrev: (page)->
        @prev = page
        if not @prev then return
        $container = page.$container
        $container.show()
        $container.css "zIndex", CURRENT_Z_INDEX - 1
        TweenLite.set $container, @prevState
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
            ntl = @nextTimeline = new TimelineLite
            ntl.to @curr.$container, @duration, @prevState, "next"
               .to @next.$container, @duration, @currState, "next"
            ntl.stop()
        if @prev
            ptl = @prevTimeline = new TimelineLite
            ptl.to @curr.$container, @duration, @nextState, "prev"
               .to @prev.$container, @duration, @currState, "prev"
            ptl.stop()
    _initEvents: ->
        swiping = (timeline, page, dist)=>
            if not page or not timeline then return
            if not @able or @isAnimating then return
            if @_isTimelineActive() then return
            timeline.progress dist / HEIGHT
        swiped = (timeline, page, dist, v, distTime)=>
            if not page or not timeline then return
            if not @able or @isAnimating then return
            if @_isTimelineActive() then return
            isRun = no
            currentProgress = dist / HEIGHT
            if dist > GAP or v > 1
                isRun = yes
                duration = (1 - currentProgress) * @duration
                @_enableAnimation duration
                timeline.progress 100
            else
                duration = 0.5
                @_enableAnimation duration
                timeline.progress 0
            setTimeout =>
                @_disableAnimation()
                if isRun then @_makePageCurrent page
            , duration * 1.1 * 1000

        gestureEvent.on "swiping up", (dist)=> swiping(@nextTimeline, @next, dist)
        gestureEvent.on "swipe up", (dist, v, distTime)=> swiped(@nextTimeline, @next, dist, v, distTime)
        gestureEvent.on "swiping down", (dist)=> swiping(@prevTimeline, @prev, dist)
        gestureEvent.on "swipe down", (dist, v, distTime)=> swiped(@prevTimeline, @prev, dist, v, distTime)

    _activeProgressByIndex: (index)->            
        $("#slide-progress li.active").removeClass "active"
        $("#progress-#{index}").addClass "active"

    _isTimelineActive: ()->
        if @nextTimeline and @nextTimeline.isActive() then return yes
        if @prevTimeline and @prevTimeline.isActive() then return yes

    _enableAnimation: (duration)->    
        @isAnimating = yes
        css = "all #{duration}s ease-out"
        if @curr then @curr.$container[0].style.webkitTransition = css
        if @prev then @prev.$container[0].style.webkitTransition = css
        if @next then @next.$container[0].style.webkitTransition = css

    _disableAnimation: ->    
        @isAnimating = no
        if @curr then @curr.$container[0].style.webkitTransition = ""
        if @prev then @prev.$container[0].style.webkitTransition = ""
        if @next then @next.$container[0].style.webkitTransition = ""

LA.util.exports FancySlide
module.exports = FancySlide
