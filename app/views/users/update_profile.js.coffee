<% if @user.errors.any? %>
alert "保存失败！"
<% else %>
alert "保存成功！"
<% end %>