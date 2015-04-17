<% if @comment.errors.size.zero? %>
  $("#comments").prepend '<%= render @comment %>'
<% else %>
  alert('你所填写的信息格式不正确！')
<% end %>