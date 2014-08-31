tpl = require "./cover.html"

class Cover extends LA.PageController
    constructor: ->
        @tpl = tpl
        @data = {"title": "Fucking, Cover..."}
        @render()
    start: ->
        tl = new TimelineMax
        tl.to @$dom.find('div'), 1, {"y": 200}
        tl.to @$dom.find('div'), 0.5, {"x": 50}
        @$dom.on "tap", =>
            TweenLite.to @$dom, 1, {
                "opacity": 0, 
                "onComplete": => @emit "done"
            }

LA.util.exports Cover
module.exports = Cover
