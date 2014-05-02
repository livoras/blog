utils = require './utils.coffee'

$submit = $('#submit')
$username = $('#username')
$password = $('#password')

$submit.click ->
  data = 
    username: $username.val()
    password: $password.val()

  promise = utils.ajax
    url: '/admin_login',
    type: 'post',
    data: data

  promise.success (data)->
    window.location.pathname = '/admin'

  promise.error (error)->
    data = error.responseJSON
    alert('登录失败：' + data.error[0])
