utils = require './utils.coffee'

$button = $('button.search')
$input = $('input.keyword')
$button.click ->
  keyword = $input.val()
  if keyword is ''
    utils.shake $input
  else  
    window.location.pathname = "/search_by_keyword/#{keyword}/1"
