require 'test_helper'

class AdminControllerTest < ActionController::TestCase
  test "should lead to login page when not login" do
    get :index
    assert_redirected_to login_url
  end

end
