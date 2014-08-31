gestureEvent = require "./gesture-event.coffee"
CURRENT_Z_INDEX = 100
HEIGHT = window.innerHeight
WIDTH = window.innerWidth
GAP = 0.3 * HEIGHT

css = ($dom, style)->
    for key, value of style
        if key is "y" then setY $dom, value
        else $dom.css key, value

setY = ($dom, y)->
    if typeof y is "string" and $dom.y
        param = if y[0] is "+" then 1 else -1
        y = $dom.y + param * (parseInt y.slice(2))
    $dom[0].style.webkitTransform = "translateY(#{y}px)"
    $dom.y = y

class EasySlide extends LA.SlideController
    constructor: ->
        @$progress = $ "<ul id='slide-progress'></ul>"
        $("div.wrapper").append @$progress
        @curr = null
        @prev = null
        @next = null
        @able = no
        @isLoop = yes
        @isReachEnd = no
        @isFirstSetCurr = yes
        @isProgressShow = yes
        @prevState = {y: -HEIGHT}
        @currState = {y: 0}
        @nextState = {y: HEIGHT}
        @duration = 1
        @isAnimating = no
        @isFast = no
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
    fast: ->
        @isFast = yes
    unfast: ->
        @isFast = no
    _makePageCurrent: (page)->
        prev = @_getPrevByIndex page.pageIndex
        next = @_getNextByIndex page.pageIndex
        if @prev then @prev.$container.hide()
        @_setCurr page
        @_setPrev prev
        @_setNext next
        if @next then @next.$container.show()
    _setCurr: (page)->
        @curr = page
        $container = page.$container
        $container.show()
        $container.css "zIndex", CURRENT_Z_INDEX
        css $container, @currState
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
        css $container, @nextState
        @emit "deactive", page
    _setPrev: (page)->
        @prev = page
        if not @prev then return
        $container = page.$container
        $container.show()
        $container.css "zIndex", CURRENT_Z_INDEX - 1
        css $container, @prevState
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
    _initEvents: ->
        gestureEvent.on "swiping up", (dist)=>
            if not @next or not @able or @isAnimating then return
            setY @next.$container, HEIGHT - dist
            setY @curr.$container, -dist
        gestureEvent.on "swipe up", (dist, v, distTime)=>
            if not @next or not @able or @isAnimating then return
            isRun = no
            currentProgress = dist / HEIGHT
            if dist > GAP or v > 1
                isRun = yes
                duration = (1 - currentProgress) * @duration
                if @isFast and v > 2 then duration = 0.15
                @_enableAnimation duration
                css @curr.$container, @prevState
                css @next.$container, @currState
            else
                duration = 0.5
                @_enableAnimation duration
                css @curr.$container, @currState
                css @next.$container, @nextState
            setTimeout =>
                @_disableAnimation()
                if isRun then @_makePageCurrent @next
            , duration * 1.1 * 1000

        gestureEvent.on "swiping down", (dist)=>
            if not @prev or not @able or @isAnimating then return
            setY @prev.$container, -HEIGHT + dist
            setY @curr.$container, dist
        gestureEvent.on "swipe down", (dist, v, distTime)=>
            if not @prev or not @able or @isAnimating then return
            isRun = no
            currentProgress = dist / HEIGHT
            if dist > GAP or v > 1
                isRun = yes
                duration = (1 - currentProgress) * @duration
                if @isFast and v > 2 then duration = 0.15
                @_enableAnimation duration
                css @curr.$container, @nextState
                css @prev.$container, @currState
            else
                duration = 0.5
                @_enableAnimation duration
                css @curr.$container, @currState
                css @prev.$container, @prevState
            setTimeout =>
                @_disableAnimation()
                if isRun then @_makePageCurrent @prev
            , duration * 1000

    _activeProgressByIndex: (index)->            
        $("#slide-progress li.active").removeClass "active"
        $("#progress-#{index}").addClass "active"
    _enableAnimation: (duration)->    
        @isAnimating = yes
        cssStr = "all #{duration}s ease-out"
        if @curr then @curr.$container[0].style.webkitTransition = cssStr
        if @prev then @prev.$container[0].style.webkitTransition = cssStr
        if @next then @next.$container[0].style.webkitTransition = cssStr
    _disableAnimation: ->    
        @isAnimating = no
        if @curr then @curr.$container[0].style.webkitTransition = ""
        if @prev then @prev.$container[0].style.webkitTransition = ""
        if @next then @next.$container[0].style.webkitTransition = ""

LA.util.exports EasySlide
module.exports = EasySlide
