require 'pg'

class Loader
  def initialize
    @con = PG::Connection.new :host => 'ec2-54-243-50-213.compute-1.amazonaws.com',
                              :port => '5432',
                              :user => 'gdgallhkmzucyp',
                              :password => 'BmSWLwkVV_Bfcjwz9sZPtSsIIX',
                              :dbname => 'd5sm1n1kpsj2ta'
  end

  def load_posts
    posts = @con.exec "SELECT * FROM POSTS ORDER BY create_time"
    posts.each do |post|
      puts "Loading post with title: #{post['title']}"
      new_post = Post.create :title => post["title"],
                  :content => post["content"],
                  :created_at => post["create_time"],
                  :updated_at => post["updated_at"],
                  :user_id => 1,
                  :status => post["status"]
      self.load_comments post, new_post
      self.load_tags post, new_post
    end
  end

  def load_comments(post, new_post)
    # create_time = sc.Column(sc.DateTime)
    # content = sc.Column(sc.String)
    # user_email = sc.Column(sc.String)
    # username = sc.Column(sc.String)
    # post_id = sc.Column(sc.Integer, sc.ForeignKey('posts.id'))
    comments = @con.exec "SELECT * FROM COMMENTS WHERE post_id='#{post["id"]}'"
    comments.each do |comment|
      puts "Loading comment with email: #{comment['user_email']}"
      Comment.create :email => comment['user_email'],
                     :content => comment['content'],
                     :name => comment['username'],
                     :post_id => new_post.id,
                     :created_at => comment['create_time']
    end
  end

  def load_tags(post, new_post)
  #     id = sc.Column(sc.Integer, primary_key=True)
  # post_id = sc.Column(sc.Integer, sc.ForeignKey('posts.id'))
  # tag_name = sc.Column(sc.String)
    tags = @con.exec "SELECT * FROM TAGS WHERE post_id='#{post["id"]}'"
    tags.each do |tag|
      puts "Loading tag with name: #{tag['tag_name']}"
      Tag.create :post_id => new_post.id,
                 :name => tag['tag_name']
    end
  end

end

loader = Loader.new

loader.load_posts
