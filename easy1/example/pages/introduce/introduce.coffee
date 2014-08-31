tpl = require "./introduce.html"

class IntroducePage extends LA.PageController
    constructor: (data)->
        @tpl = tpl
        @data = data or {}
        @render()
        # @tl = new TimelineLite
        # @$padding = @$dom.find "div.padding"

        # @tl.to @$padding, 0.5, {"x": 0, "autoAlpha": 0.5}
        # @tl.to @$padding, 0.5, {"y": -20, "autoAlpha": 1}
        
        @stop()

    start: -> 
        # @tl.restart()

    stop: ->
        # @tl.kill()
        @_reset()

    _reset: ->
        # TweenLite.set @$padding, {"x": -300, "autoAlpha": 0}

LA.util.exports IntroducePage
module.exports = IntroducePage