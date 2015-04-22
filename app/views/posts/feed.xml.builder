xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
  xml.channel do
    xml.title APP_CONFIG['blog_name']
    xml.description APP_CONFIG['blog_description']
    xml.link "http://#{APP_CONFIG['host']}"
    xml.language "zh-CN"

    @posts.each do |post|
      xml.item do 
        xml.title post.title
        xml.description markdown(post.content)
        xml.author post.author.name
        xml.comments post_url(post) + "#comments"
        xml.link post_url(post)
        xml.pubDate post.created_at.to_s(:rfc822)
      end
    end
  end
end