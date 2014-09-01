# @author: Livoras
# @description: PageController can be used as super class of `page` or `cover`

{toBeImplemented} = require "../util.coffee"

class PageController extends EventEmitter2
    constructor: (@data)-> @$dom = null
    start: -> toBeImplemented()
    stop: -> toBeImplemented()
    setBackground: (url)->
        @$dom.css "backgroundImage", "url(#{url})"
    render: ->  
        @compileFunc = template.compile(@tpl)
        @$dom = $(@compileFunc @data)
        if @data.bg then @setBackground @data.bg

module.exports = PageController
