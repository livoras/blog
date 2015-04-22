class Comment < ActiveRecord::Base
  belongs_to :post
  validates :email, presence: true, format: {with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, message: "email is not valid"} 
  validates :name, presence: true, format: {with: /\A[_\w\d]{2,31}\z/i, message: "name should be 2~31 underscore or char or number"}
  validates :content, presence: true

  default_scope -> {order "created_at DESC"}
end
