(function() {

  var $submitComment = $('#submit-new-comment')
  var $newCommentForm = $('#new-comment-form')

  $submitComment.click(function(event) {
    event.preventDefault()
    var dataStr = $newCommentForm.serialize()
    var data = blog.utils.getJSONFromQueryStr(dataStr)

    var promise = blog.utils.ajax({
      url: '/new_comment',
      type: 'post',
      data: data
    })

    promise.success(function(data) {
      console.log(data)
    })

    promise.error(function(error) {
      alert('发送失败：' + error.responseJSON.error[0])
    })
  })

})()