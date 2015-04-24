class Post < ActiveRecord::Base
  belongs_to :user
  has_many :comments, :dependent => :destroy
  has_many :tags, :dependent => :destroy

  def all_tags
    tags.map { |tag| tag.name }
  end

  def author
    user
  end

  def private?
    status == "private"
  end
end
