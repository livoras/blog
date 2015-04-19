  # database: d5sm1n1kpsj2ta
  # pool: 5
  # username: gdgallhkmzucyp 
  # password: BmSWLwkVV_Bfcjwz9sZPtSsIIX
  # host: ec2-54-243-50-213.compute-1.amazonaws.com
  # port: 5432
require 'pg'

con = PG::Connection.new :host => 'ec2-54-243-50-213.compute-1.amazonaws.com',
                         :port => '5432',
                         :user => 'gdgallhkmzucyp',
                         :password => 'BmSWLwkVV_Bfcjwz9sZPtSsIIX',
                         :dbname => 'd5sm1n1kpsj2ta'

posts = con.exec "SELECT * FROM POSTS ORDER BY create_time"
puts posts[0]
posts[0].each do |key, value|
  puts key
end
# posts.each do |post|
#   post.each do |key, value|
#   end
# end
