$ = (selector)-> 
    doms = document.querySelectorAll selector
    if doms.length is 1 
        dom = doms[0]
        dom.on = ->
            dom.addEventListener.apply dom, arguments
        return doms[0]
    doms

removeClass = ($dom, className)->
    if not $dom then return
    klass = $dom.className
    $dom.className = klass.replace ///\s#{className}\s?///, " "

addClass = ($dom, className)->
    if not $dom then return
    classes = $dom.className.split " "
    if className not in classes
        if $dom.className.match /\s$/
            $dom.className += "#{className}"
        else 
            $dom.className += " #{className}"

setBackground = ($dom, url)->
    $dom.style.backgroundImage = "url(#{url})"

setRotate = ($dom, deg)->
    $dom.style.webkitTransform = "rotateZ(#{deg + 'deg'})"

class Iterator
    constructor: (list, isLoop)->
        @list = list
        @index = 0
        @isLoop = isLoop or no
    set: (index)->
        @index = index
    next: ->
        if @index + 1 is @list.length
            if @isLoop then @index = 0 else return
        else
            @index++
        @list[@index]
    prev: ->
        if @index - 1 <= 0
            if @isLoop then @index = @list.length - 1 else return
        else
            @index--
        @list[@index]
    current: ->
        @list[@index]

clip = (img, width, height, percentage)->
    percentage = percentage or 0.8
    iw = img.width
    ih = img.height

    if width / height > iw / ih
        sw = iw * percentage
        sh = sw * height / width
    else
        # height
        sh = ih * percentage
        sw = sh * width / height

    sx = (iw - sw) / 2
    sy = (ih - sh) / 2

    {sx, sy, sw, sh}


module.exports = {
    $, Iterator, clip,
    addClass, removeClass,
    setBackground, setRotate
}