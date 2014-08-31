# @author: Livoras
# @description: PageController can be used as super class of `page` or `cover`

{toBeImplemented} = require "../util.coffee"

class LoadingController extends EventEmitter2
    constructor: -> @$dom = null
    dismiss: (callback)-> toBeImplemented()
    render: ->  
        @compileFunc = template.compile(@tpl)
        @$dom = $(@compileFunc @data)

module.exports = LoadingController
