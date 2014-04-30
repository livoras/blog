(function() {

  var $submitComment = $('#submit-new-comment')
  var $newCommentForm = $('#new-comment-form')

  $submitComment.click(function(event) {
    event.preventDefault()
    var dataStr = $newCommentForm.serialize()
    var data = blog.utils.getJSONFromQueryStr(dataStr)

    var promise = blog.utils.ajax({})
  })

})()