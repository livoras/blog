utils = require "./utils.coffee"
$submitComment = $('#submit-new-comment')
$newCommentForm = $('#new-comment-form')
$comments = $('div.comments:eq(0)')

$emailInput = $newCommentForm.find('input[name=email]:eq(0)')
$usernameInput = $newCommentForm.find('input[name=name]:eq(0)')
$commentContent = $newCommentForm.find('textarea[name=content]:eq(0)')

isSending = no
$commentsCount = $('span.count:eq(0)')
commentsCount = parseInt($commentsCount.html())

initSubmitComment = ->
  $("#submit-new-comment").click (event)->
    event.preventDefault()
    if isSending then return
    data = $newCommentForm.serializeObject()
    if not checkValid(data) then return
    isSending = yes
    req = $.ajax({
      url: "/comments.json"
      type: "POST"
      data: data
    })

    req.success (comment)->
      isSending = no
      showComment $(comment.html)
      incCommentsCount()
      clearForm()

    req.error (error)->
      isSending = no
      alert('发送失败：' + error.responseJSON.error[0])

checkValid = (data)->
  EMAIL_REG =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if not EMAIL_REG.test(data.email)
    utils.shake $emailInput
    return no
  if not (2 <= data.name.length <= 16)
    utils.shake $usernameInput
    return no
  if not (1 <= data.content.length <= 140)
    utils.shake $commentContent
    return no
  yes  

incCommentsCount = ->
  $commentsCount.text(++commentsCount)

clearForm = ->
  $newCommentForm.find('textarea:eq(0)').val('')

showComment = ($comment)->
  $comments.prepend($comment)
  $comment.hide()
  $comment.fadeIn(1000)

initSubmitComment()
