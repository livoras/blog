Slide = require "./slide/slide.coffee"
Loading = require "./loading/loading.coffee"
Cover = require "./cover/cover.coffee"

IntroducePage = require "./pages/introduce/introduce.coffee"
TextPage = require "./pages/text/text.coffee"
EndPage = require "./pages/end/end.coffee"

{$, log} = LA.util
core = LA.core

run = ->
    # test setting loading
    loading = new Loading
    core.setLoading loading

    # test setting cover
    cover = new Cover
    core.setCover cover

    # test adding page
    core.addPage new IntroducePage
    core.addPage new TextPage
    core.addPage new EndPage
    
    # test setting slide
    slide = new Slide
    core.setSlide slide
    
    slide.enable()


run()
