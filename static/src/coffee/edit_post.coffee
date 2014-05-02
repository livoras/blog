utils = require './utils.coffee'
markdown = (require 'markdown').markdown

$form = $('form.edit-post-form')

renderForm = (data)->
  $form.find('textarea[name=content]').val(data.content)
  $form.find('input[name=title]').val(data.title)
  $form.find('input[name=tags]').val(data.tags.join(';'))
  $form.find('input[name=status]').each (i, input)->
    $(input).prop('checked',data.status is $(input).val())

renderForm(post)

postId = post.id

$submit = $('button.update')
$submit.click ->
  data = $form.serializeObject()
  data.tags = utils.parseTagsStr(data.tags)
  data.id = postId

  promise = utils.ajax 
    url: '/update_post'
    data: data
    type: 'put'

  promise.success (data)->  
    data = data.data
    window.location.pathname = "/post/#{data.id}"

  promise.error (error)->  
    alert '修改失败：' + utils.getError(error)

# delete comment
$('button.delete-comment').click (event)->
  $button = $(event.currentTarget)
  data = {id: $button.data('comment-id')}

  promise = utils.ajax 
    url: '/delete_comment'
    type: 'delete'
    data: data

  promise.success (event)->
    $button.parent('li').remove()

  promise.error (error)->  
    alert '删除失败：' + utils.getError(error)
