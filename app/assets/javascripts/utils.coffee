utils = {}

# Serialize form into JSON object
# Streal from: http://css-tricks.com/snippets/jquery/serialize-form-to-json/
$.fn.serializeObject = ->
   o = {};
   a = this.serializeArray();
   $.each a, ->
     if (o[this.name])
       if (!o[this.name].push)
           o[this.name] = [o[this.name]]
       o[this.name].push(this.value or '')
     else 
       o[this.name] = this.value or ''
   o

utils.ajax = (data)->
  if data.data
    data.data = JSON.stringify(data.data)
    data.contentType = 'application/json'
  $.ajax(data)


utils.getError = (error)->
  error.responseJSON.error[0]

utils.parseTagsStr = (tagsStr)->
  if tagsStr then tagsStr.replace(/[;；]$/, '').split(/[;；]/g) else []

utils.shake = ($dom)->  
  $dom.css('position', 'relative') if $dom.css('position') is 'static'
  $dom.focus()
  dur = 80
  count = 0
  if $dom.isRunning then return
  $dom.isRunning = yes
  shake = ->
    count++
    dist = 5
    if count is 3 
      $dom.isRunning = no
      return
    $dom.animate 
      'left': "-=#{dist}px"
    , dur, ->  
      $dom.animate 
        'left': "+=#{2 * dist}px"
      , dur, ->
        $dom.animate 
          'left': "-=#{dist}px"
        , dur, shake  
  shake()    

module.exports = utils
