class Post < ActiveRecord::Base
  has_many :comments
  has_many :tags

  def all_tags
    tags.map { |tag| tag.name }
  end
end
