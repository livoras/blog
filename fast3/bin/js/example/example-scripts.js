(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, core, data, log, run, _ref;

_ref = LA.util, $ = _ref.$, log = _ref.log;

core = LA.core;

data = {
  cover: {
    id: "1",
    data: {}
  },
  loading: {
    id: "2",
    data: {}
  },
  slide: {
    id: "3",
    data: {}
  },
  pages: [
    {
      id: "4",
      data: {
        name: "Harry",
        bg: "/example/assets/img/bg.jpg"
      }
    }, {
      id: "5",
      data: {
        name: "Lucy",
        bg: "/example/assets/img/end.jpg"
      }
    }, {
      id: "6",
      data: {
        name: "Tony",
        bg: "/example/assets/img/appBg2.jpg"
      }
    }, {
      id: "6",
      data: {
        name: "Jessie",
        bg: "http://img4.duitang.com/uploads/item/201311/20/20131120103129_nsMFy.jpeg"
      }
    }, {
      id: "6",
      data: {
        name: "Funny",
        bg: "http://img4.duitang.com/uploads/item/201207/30/20120730122807_KxJVT.thumb.600_0.jpeg"
      }
    }, {
      id: "6",
      data: {
        name: "Pony",
        bg: "http://cdn.duitang.com/uploads/item/201212/21/20121221163047_wkC8U.thumb.600_0.jpeg"
      }
    }
  ]
};

run = function() {
  var cover, loading, pageData, slide, _i, _len, _ref1;
  loading = new LA.modules[data.loading.id](data.loading.data);
  core.setLoading(loading);
  cover = new LA.modules[data.cover.id](data.cover.data);
  _ref1 = data.pages;
  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
    pageData = _ref1[_i];
    core.addPage(new LA.modules[pageData.id](pageData.data));
  }
  slide = new LA.modules[data.slide.id](data.slide.data);
  return core.setSlide(slide);
};

run();



},{}]},{},[1]);