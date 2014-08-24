tpl = require "./loading.html"

class Loading extends LA.LoadingController
    constructor: ->
        @tpl = tpl
        @data = {"text": "Loading..."}
        @render()
        
    dismiss: (callback)->
        # setTimeout to make fake loading effect
        setTimeout =>
            TweenLite.to @$dom, 0.5, {"opacity": 0, onComplete: callback}
        , 1000

module.exports = Loading
