require "../../lib/init"

world = {}
timer = null
spirts = []

world.start = ->
    run = ->
        for spirt in spirts
            spirt.move()
        timer = requestAnimationFrame run
    run()

world.add = (spirt)->
    spirts.push spirt

module.exports = world