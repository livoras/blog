hbs = require 'handlebars'
utils = require './utils.coffee'
commentTpl = require '../tpl/comment.hbs'

$submitComment = $('#submit-new-comment')
$newCommentForm = $('#new-comment-form')
$comments = $('div.comments:eq(0)')

commentTpl = hbs.compile(commentTpl)

clearForm = ->
  $newCommentForm.find('textarea:eq(0)').val('')

$submitComment.click (event)->
  event.preventDefault()
  data = $newCommentForm.serializeObject()

  promise = utils.ajax 
    url: '/new_comment',
    type: 'post',
    data: data

  promise.success (data)->
    $newComment = $ commentTpl(data.data)
    $comments.prepend($newComment)
    clearForm()

  promise.error (error)->
    alert('发送失败：' + error.responseJSON.error[0])
