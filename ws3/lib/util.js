function extend(Constructor, prototype) {
    var Super = this
    function Sub() { Constructor.apply(this, arguments) }
    function F() {}
    F.prototype = Super.prototype
    Sub.prototype = new F()
    for (var prop in prototype) {
        Sub.prototype[prop] = prototype[prop]
    }
    Sub.prototype.constructor = Constructor
    Sub.name = Constructor.name
    Sub.extend = extend
    return Sub
}

function $(selector) {
    var doms = document.querySelectorAll(selector)
    if (doms.length == 1) return doms[0]
    return doms
}

module.exports = {
    extend: extend,
    $: $
}
