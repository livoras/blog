$ = require 'jquery'
utils = require './utils.coffee'

$button = $('#logout')

$button.click ->
  promise = utils.ajax 
    type: 'post',
    url: '/admin_logout'

  promise.success (data)->
    window.location.reload()
  
  promise.error (error)->
    alert '退出失败：' + error.responseJSON.error[0]
