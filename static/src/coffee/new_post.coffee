utils = require './utils.coffee'
markdown = (require 'markdown').markdown

$form = $('form.edit-post-form')
$submit = $('button.create')

$submit.click (event)->
  event.preventDefault()
  data = $form.serializeObject()
  data.tags = utils.parseTagsStr(data.tags)

  promise = utils.ajax
    url: '/new_post'
    type: 'post'
    data: data

  promise.success (data)->
    window.location.pathname = '/post/' + data.data.id

  promise.fail (error) ->
    $('body').html(error.responseText)
