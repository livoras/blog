$ = (selector)-> 
    doms = document.querySelectorAll selector
    if doms.length is 1 
        dom = doms[0]
        dom.on = ->
            dom.addEventListener.apply dom, arguments
        return doms[0]
    doms

module.exports = {$}