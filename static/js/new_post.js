(function(global) {
  var $form = $('#create-new-post-form')
  var $submit = $('#create')

  $submit.click(function(event) {
    event.preventDefault( )
    var queryStr = $form.serialize()
    var data = blog.utils.getJSONFromQueryStr(queryStr)
    tagsStr = unescape(data.tags)
    data.tags = tagsStr ? tagsStr.split(/[;；]/g) : []

    var promise = blog.utils.ajax({
      url: '/new_post',
      type: 'post',
      data: data
    })

    promise.success(function(data) {
      window.location.pathname = '/post/' + data.data.id
    })

    promise.fail(function(error) {
      $('body').html(error.responseText)
    })
  })
})(window)