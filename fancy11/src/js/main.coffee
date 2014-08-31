core = require "./core.coffee"
PageController = require "./controllers/page-controller.coffee"
SlideController = require "./controllers/slide-controller.coffee"
LoadingController = require "./controllers/loading-controller.coffee"
util = require "./util.coffee"

modules = {}

# Configuration Data
config = {}

set = (key, value)->
    config[key] = value

get = (key)->
    config[key]

LA = window.LA = {
    core, PageController, util, modules
    SlideController, LoadingController, get, set
}
