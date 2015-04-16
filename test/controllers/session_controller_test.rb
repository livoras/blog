require 'test_helper'

class SessionControllerTest < ActionController::TestCase
  setup do
    @user = User.create email: 'livoras@163.com', plain_password: '123456', plain_password_confirmation: '123456', name: 'jerry'
  end

  test "should show login form" do
    get :new
    assert_response :success
  end

  test "should login" do
    post :create, email: @user.email, password: @user.plain_password
    assert_equal session[:user_id], @user.id
    assert_redirected_to root_url
  end

  test "should login failed" do
    post :create, email: @user.email, password: @user.plain_password + 'fuck'
    assert_equal session[:user_id], nil
    assert_equal flash[:error], 'Login failed!'
    assert_redirected_to login_url
  end

  test "should get destroy" do
    delete :destroy
    assert_response :success
  end

end
