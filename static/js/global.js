(function(global) {
  var blog = global.blog = {}
  var utils = blog.utils = {}

  utils.ajax = function(data) {
    if (data.data) {
      data.data = JSON.stringify(data.data)
      data.contentType = 'application/json;charset=UTF-8'
    }
    return $.ajax(data)
  }

  utils.getJSONFromQueryStr = function(str) {
    var dataItems = str.split('&')
    var data = {}
    for (var i = 0, len = dataItems.length; i < len; i++) {
      var tuple = dataItems[i].split('=')
      data[tuple[0]] = tuple[1] ? tuple[1] : ""
    }
    return data
  }

})(window)