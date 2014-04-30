(function() {
  var $button = $('#logout')
  $button.click(function() {
    var promise = blog.utils.ajax({
      type: 'post',
      url: '/admin_logout'
    })
    promise.success(function(data) {
      window.location.reload()
    })
    promise.error(function(error) {
      alert('退出失败：' + error.responseJSON.error[0])
    })
  })
})()