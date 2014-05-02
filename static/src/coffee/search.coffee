$('button.search').click ->
  keyword = $('input.keyword').val()
  window.location.pathname = "/search_by_keyword/#{keyword}/1"
