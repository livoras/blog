utils = require './utils.coffee'

# logout
$button = $('#logout')
$button.click ->
  promise = utils.ajax 
    type: 'post',
    url: '/admin_logout'

  promise.success (data)->
    window.location.reload()
  
  promise.error (error)->
    alert '退出失败：' + utils.getError(error)


# profile update
$updateProfile = $('button.update-profile:eq(0)')
$updateProfileForm = $('form.profile-update:eq(0)')

$updateProfile.click (event)->
  event.preventDefault()
  data = $updateProfileForm.serializeObject()

  promise = utils.ajax 
    type: 'post',
    url: '/update_admin_profile'
    data: data

  promise.success (data)->
    for key, value of data.data
      $updateProfileForm.find("input[name=#{key}]").val(value)
    alert 'OK!'  
  
  promise.error (error)->
    alert '修改失败：' + utils.getError(error)


# password update    
$updatePassword = $('button.update-password:eq(0)')
$updatePasswordForm = $('form.password-update:eq(0)')

$updatePassword.click (event)->
  event.preventDefault()
  data = $updatePasswordForm.serializeObject()

  promise = utils.ajax 
    type: 'put',
    url: '/update_admin_password'
    data: data

  promise.success (data)->
    $updatePasswordForm.find('input').val('')
    alert 'OK!'  
  
  promise.error (error)->
    alert '修改失败：' + utils.getError(error)


# delete post
$('.delete-post').click (event)->
  $button = $(event.target)
  data = {id: $button.data('post-id')}

  promise = utils.ajax
    type: 'delete'
    url: '/delete_post'
    data: data

  promise.success (data)->
    $button.parent('li').remove()

  promise.error (error)->  
    alert '删除失败：' + getError(error)
