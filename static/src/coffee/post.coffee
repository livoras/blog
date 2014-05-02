hbs = require 'handlebars'
utils = require './utils.coffee'
commentTpl = require '../tpl/comment.hbs'
markdown = (require 'markdown').markdown

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
    comment = data.data
    createTime = comment.create_time.toString()
    timeStr = ""
    timeStr += createTime.slice(8, 11)
    timeStr += createTime.slice(4, 7)
    timeStr += ', '
    timeStr += createTime.slice(14, 16)
    comment.create_time = timeStr
    $newComment = $ commentTpl(comment)
    $comments.prepend($newComment)
    clearForm()

  promise.error (error)->
    alert('发送失败：' + error.responseJSON.error[0])


# Render post content
$postContent = $('div.post-content')
content = postData.content.replace(/\\\>/g, '>')
$postContent.html(markdown.toHTML(content))
