# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create({email: "admin@admin.com", name: "admin", plain_password: "123456", plain_password_confirmation: "123456"})

posts = [{user_id: 1, title: 'Hello, Simple Blog!', content: %{
## 开始撰写你的博文吧！

Hello, Simple Blog!

![block](/assets/demo.jpeg)

你可以对博客进行自定义的配置：

1. 修改`config/config.yml`修改博客的名称（`blog_name`）和描述（`blog_description`）。
2. 博客管理员默认登陆邮箱和密码为`admin@admin.com`和`123456`，请及时[登录](/login)修改登录邮箱和密码。
3. 修改`config/environments/development.rb`, `config/environments/production.rb`修改博客评论邮件提示邮箱配置。

登录以后即可以进行博文、评论的管理，点击左上角的"New Post"进行新博文编写，采用Markdown语法生成博文内容。}}]

Post.create(posts)

Tag.create([{name: "启程", post_id:1}])

# Comment.create([
#   {email: "fuck@you.com", name: "Livoras", content: "I love this post", post_id: 1},
#   {email: "fuck@you.com", name: "Livoras", content: "I love this post", post_id: 1},
#   {email: "fuck@you.com", name: "Livoras", content: "I love this post", post_id: 1},
#   {email: "fuck@you.com", name: "Livoras", content: "I love this post", post_id: 1}
# ])

