$("#post-<%= @post.id %>").remove()

$postCount = $ "#post-count"
$postCount.text(parseInt($postCount.text()) - 1)
