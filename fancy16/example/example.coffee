{$, log} = LA.util

Loading = require "./loading/loading.coffee"
Cover = require "./cover/cover.coffee"
Slide = require "./fancy-slide/fancy-slide.coffee"
IntroducePage = require "./pages/introduce/introduce.coffee"

core = LA.core

pages = [
   # {name: "Jessie", bg: "http://img4.duitang.com/uploads/item/201311/20/20131120103129_nsMFy.jpeg" }
   # {name: "Funny", bg: "http://img4.duitang.com/uploads/item/201207/30/20120730122807_KxJVT.thumb.600_0.jpeg" }
   # {name: "Pony", bg: "http://cdn.duitang.com/uploads/item/201212/21/20121221163047_wkC8U.thumb.600_0.jpeg" }
   {title: "Who the fuck you are? ", name: "Harry?", bg: "example/assets/img/bg.jpg"}
   {title: "I am ", name: "Lucy.", bg: "example/assets/img/end.jpg" }
   {title: "No, you are ", name: "Tony.", bg: "example/assets/img/appBg2.jpg" }
   {title: "FUCK YOU!!!!!!!!!", name: "Tony.", bg: "http://wx.nen.com.cn/imagelist/11/24/85715iy4e5h2.jpg" }
]

run = ->
    TweenMax.set "body", {"backgroundColor": "#444"}
    loading = new Loading
    # core.setLoading loading

    cover = new Cover
    # core.setCover cover

    for pageData in pages
        core.addPage (new IntroducePage pageData)
    
    slide = new Slide
    core.setSlide slide
    loading.dismiss()
    core.start()

run()

# TweenMax.set "body", {
#     backgroundColor: "#000"
# }
# TweenMax.set "#page", {
#     "position": "fixed"
#     "margin": "0 auto"
#     "top": "0"
#     "left": "0"
#     "right": "0"
#     "width": "100%"
#     "height": "100%"
#     "backgroundColor": "#b54322"
# }
# TweenMax.set "#page2", {
#     "position": "fixed"
#     "margin": "0 auto"
#     "top": "0"
#     "left": "0"
#     "right": "0"
#     "width": "100%"
#     "height": "100%"
#     "backgroundColor": "#3385ff"
#     # y: window.innerHeight
#     scaleX: 1.5
#     scaleY: 1.5
#     autoAlpha: 0
# }

# DURATION = 1
# SCALE = 0.6
# ALPHA = 0
# TweenMax.to "#page", DURATION, {autoAlpha: ALPHA, scaleX: SCALE, scaleY: SCALE, transformOrigin:"50% 50%"}
# # TweenMax.to("#page2", DURATION, {autoAlpha: 1, y: 0, transformOrigin:"50% 50%"})
# TweenMax.to("#page2", DURATION, {autoAlpha: 1,i transformOrigin:"50% 50%"})
