$ = require 'jquery'

utils = {}

utils.ajax = (data)->
  if data.data
    data.data = JSON.stringify(data.data)
    data.contentType = 'application/json;charset=UTF-8'
  $.ajax(data)

utils.getJSONFromQueryStr = (str)->
  dataItems = str.split('&')
  data = {}
  for dataItem, i in dataItems
    tuple = dataItem.split('=')
    data[tuple[0]] = tuple[1] or ""
  data

module.exports = utils
