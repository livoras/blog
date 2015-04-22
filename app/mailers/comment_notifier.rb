class CommentNotifier < ApplicationMailer
  default :from => "noreplylivoras@163.com"

  def notify_author(comment, author)
    @comment = comment 
    @author = author
    mail :to => author.email, :subject => "Livoras\'s Blog: New Comment!"
  end

  def notify_commentor(comment, author, current_comment)
    @comment = comment 
    @author = author
    @current_comment = current_comment
    mail :to => comment.email, :subject => "Livoras\'s Blog: New Comment!"
  end

end
