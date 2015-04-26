<% if @user.errors.any? %>
alert "保存失败！" + "<%= @user.errors.full_messages.join ';' %>"
<% else %>
alert "保存成功！"
$("input[type=password]").val ""
<% end %>