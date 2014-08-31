log = ->
    console.log.apply console, arguments

toBeImplemented = ->
    throw "ERROR: Should Be Implemented!"

injectStyle = (styleStr)->
    $style = $ "<style></style>"
    $style.html styleStr
    $(document.body).append $style

getCurrentScript = ->    
    if document.currentScript
        return document.currentScript
    else
        scripts = document.getElementsByTagName 'script'
        return scripts[scripts.length - 1]

exports = (module)->    
    id = getCurrentDataId()
    LA.modules[id] = module

getCurrentDataId = ->
    $script = $ getCurrentScript()
    $script.attr "data-id"

$ = window.$ = $$

module.exports = {
    $, log, toBeImplemented, 
    injectStyle, getCurrentScript, exports
}
