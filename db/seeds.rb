# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

posts = 100.times.map do |i|
  {title: "title - #{i}", content: "Fuck you every day for everyday.#{i}"}
end

Post.create(posts)

Tag.create([
  {name: "tag1", post_id:1},
  {name: "tag2", post_id:1}
])