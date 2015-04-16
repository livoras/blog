require 'digest/sha2'

class User < ActiveRecord::Base
  validates :name, :presence => true
  validates :email, :presence => true, :uniqueness => true
  validates :plain_password, :presence => true, :confirmation => true
  validates :plain_password_confirmation, :presence => true
  has_many :posts, :dependent => :destroy

  attr_reader :plain_password

  def plain_password=(plain_password)
    @plain_password = plain_password
    self.password = self.class.encrypt(plain_password)
  end

  class << self
    def authenticate(email, plain_password)
      user = find_by(:email => email)
      if (!user.nil?) && (user.password == encrypt(plain_password))
        return user
      else
        return nil
      end
    end

    def encrypt(plain_password)
       Digest::SHA2.hexdigest(plain_password + "fuck")
    end
  end
end
