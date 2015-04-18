class CommentNotifier < ApplicationMailer
  default :from => "noreplylivoras@163.com"

  def notify_author(comment, author)
    @comment = comment 
    @author = author
    mail :to => author.email, :subject => "Livoras\'s Blog: New Comment!"
  end

  def notify_commentor(comment, author)
  end

end
