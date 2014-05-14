hbs = require 'handlebars'
utils = require './utils.coffee'
commentTpl = require '../tpl/comment.hbs'
marked = require 'marked'
highlight = require 'highlight.js'

$submitComment = $('#submit-new-comment')
$newCommentForm = $('#new-comment-form')
$comments = $('div.comments:eq(0)')

commentTpl = hbs.compile(commentTpl)

$emailInput = $newCommentForm.find('input[name=user_email]:eq(0)')
$usernameInput = $newCommentForm.find('input[name=username]:eq(0)')
$commentContent = $newCommentForm.find('textarea[name=content]:eq(0)')

isSending = no
$commentsCount = $('span.count:eq(0)')
commentsCount = parseInt($commentsCount.html())

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
    comment.create_time = getProperTimeStr(comment.create_time)
    $newComment = $ commentTpl(comment)
    showComment($newComment)
    incCommentsCount()
    clearForm()

  promise.error (error)->
    isSending = no
    alert('发送失败：' + error.responseJSON.error[0])

showComment = ($comment)->
  $comments.prepend($comment)
  $comment.hide()
  $comment.fadeIn(600)

incCommentsCount = ->
  $commentsCount.text(++commentsCount)

getProperTimeStr = (create_time)->    
  createTime = create_time.toString()
  timeStr = ""
  timeStr += createTime.slice(8, 11)
  timeStr += createTime.slice(4, 7)
  timeStr += ', '
  timeStr += createTime.slice(14, 16)
  timeStr


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
marked.setOptions
  highlight: (code)->
    highlight.highlightAuto(code).value

$postContent = $('div.post-content')
content = postData.content.replace(/\\\>/g, '>')
$postContent.html(marked(content))
$('pre code').addClass('hljs')
