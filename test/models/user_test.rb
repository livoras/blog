require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  setup do
    @user = User.create :email => 'livoras@163.com', :plain_password => '123456', :plain_password_confirmation => '123456', :name => 'livoras'
  end

  test 'password should be encrypted when write' do
    assert @user.password != '123456'
  end

  test 'authenticate password' do
    assert User.authenticate(@user.email, '123456'), 'authenticate failed'
  end

  test 'logout' do
    # session[:user_id] = @user.id
    # delete :destroy
    # assert session[:user_id], nil
  end
end
