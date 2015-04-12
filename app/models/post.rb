class Post < ActiveRecord::Base
  has_many :comment
  has_many :tags

  def all_tags
    tags.map { |tag| tag.name }
  end
end
