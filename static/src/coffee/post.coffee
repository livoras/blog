$ = require 'jquery'
utils = require './utils.coffee'

$submitComment = $('#submit-new-comment')
$newCommentForm = $('#new-comment-form')

$submitComment.click (event)->
  event.preventDefault()
  dataStr = $newCommentForm.serialize()
  data = utils.getJSONFromQueryStr(dataStr)

  promise = utils.ajax 
    url: '/new_comment',
    type: 'post',
    data: data

  promise.success (data)->
    console.log(data)

  promise.error (error)->
    alert('发送失败：' + error.responseJSON.error[0])
