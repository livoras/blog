(function() {

var $submit = $('#submit')
var $username = $('#username')
var $password = $('#password')

$submit.click(function() {
  var data = {
    username: $username.val(),
    password: $password.val()
  }

  var promise = blog.utils.ajax({
    url: '/admin_login',
    type: 'post',
    data: data
  })

  promise.success(function(data) {
    window.location.pathname = '/admin'
  })

  promise.error(function(error) {
    data = error.responseJSON
    alert('登录失败：' + data.error[0])
  })
});

})();