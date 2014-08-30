tpl = require "./loading.html"

class Loading extends LA.LoadingController
    constructor: ->
        @tpl = tpl
        @data = {"text": "Loading..."}
        @render()
        
    dismiss: ->
        # setTimeout to make fake loading effect
        onComplete = => @emit "dismissed"
        TweenLite.to @$dom, 0.5, {"opacity": 0, onComplete: onComplete}

LA.util.exports Loading
module.exports = Loading
