$ = require 'jquery'
utils = require './utils.coffee'
markdown = (require 'markdown').markdown

$form = $('#create-new-post-form')
$submit = $('#create')

console.log(markdown.toHTML('## fuckyou'))

$submit.click (event)->
  event.preventDefault()
  queryStr = $form.serialize()
  data = utils.getJSONFromQueryStr(queryStr)
  tagsStr = unescape(data.tags)
  data.tags = if tagsStr then tagsStr.split(/[;；]/g) else []

  promise = utils.ajax
    url: '/new_post'
    type: 'post'
    data: data

  promise.success (data)->
    window.location.pathname = '/post/' + data.data.id

  promise.fail (error) ->
    $('body').html(error.responseText)
