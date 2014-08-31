# @author: Livoras
# @description: PageController can be used as super class of `page` or `cover`

{toBeImplemented} = require "../util.coffee"

class SlideController extends EventEmitter2
    constructor: -> @$dom = null
    init: (pages)-> toBeImplemented()
    enable: -> toBeImplemented()
    disable: -> toBeImplemented()

module.exports = SlideController
