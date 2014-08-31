{$, log} = LA.util
core = LA.core

data = {
    cover: {id: "1", data: {}}
    loading: {id: "2", data: {}}
    slide: {id: "3", data: {}}
    pages: [
        {id: "4", data: {name: "Harry", bg: "/example/assets/img/bg.jpg"}}
        {id: "5", data: {name: "Lucy", bg: "/example/assets/img/end.jpg" }}
        {id: "6", data: {name: "Tony", bg: "/example/assets/img/appBg2.jpg" }}
        {id: "6", data: {name: "Jessie", bg: "http://img4.duitang.com/uploads/item/201311/20/20131120103129_nsMFy.jpeg" }}
        {id: "6", data: {name: "Funny", bg: "http://img4.duitang.com/uploads/item/201207/30/20120730122807_KxJVT.thumb.600_0.jpeg" }}
        {id: "6", data: {name: "Pony", bg: "http://cdn.duitang.com/uploads/item/201212/21/20121221163047_wkC8U.thumb.600_0.jpeg" }}
    ]
}

run = ->
    loading = new LA.modules[data.loading.id] data.loading.data
    core.setLoading loading

    cover = new LA.modules[data.cover.id] data.cover.data
    # core.setCover cover

    for pageData in data.pages
        core.addPage new LA.modules[pageData.id] pageData.data
    
    slide = new LA.modules[data.slide.id] data.slide.data
    core.setSlide slide

run()
