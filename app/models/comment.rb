class Comment < ActiveRecord::Base
  belongs_to :post
  validates :email, presence: true, format: {with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, message: "email is not valid"} 
  validates :name, length: {minimum: 2, maximum: 30}
  validates :content, presence: true

  default_scope -> {order "created_at DESC"}
end
