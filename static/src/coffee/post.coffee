hbs = require 'handlebars'
utils = require './utils.coffee'
commentTpl = require '../tpl/comment.hbs'
markdown = (require 'markdown').markdown

$submitComment = $('#submit-new-comment')
$newCommentForm = $('#new-comment-form')
$comments = $('div.comments:eq(0)')

commentTpl = hbs.compile(commentTpl)

$emailInput = $newCommentForm.find('input[name=user_email]:eq(0)')
$usernameInput = $newCommentForm.find('input[name=username]:eq(0)')
$commentContent = $newCommentForm.find('textarea[name=content]:eq(0)')

isSending = no

$submitComment.click (event)->
  event.preventDefault()
  if isSending then return
  data = $newCommentForm.serializeObject()
  if not checkValid(data) then return

  isSending = yes
  promise = utils.ajax 
    url: '/new_comment',
    type: 'post',
    data: data

  promise.success (data)->
    isSending = no
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
    $newComment.hide()
    $newComment.fadeIn(600)
    clearForm()

  promise.error (error)->
    isSending = no
    alert('发送失败：' + error.responseJSON.error[0])

checkValid = (data)->
  EMAIL_REG =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if not EMAIL_REG.test(data.user_email)
    utils.shake $emailInput
    return no
  if not (4 <= data.username.length <= 16)
    utils.shake $usernameInput
    return no
  if not (1 <= data.content.length <= 140)
    utils.shake $commentContent
    return no
  yes  


clearForm = ->
  $newCommentForm.find('textarea:eq(0)').val('')


# Render post content
$postContent = $('div.post-content')
content = postData.content.replace(/\\\>/g, '>')
$postContent.html(markdown.toHTML(content))
