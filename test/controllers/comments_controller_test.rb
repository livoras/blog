require 'test_helper'

class CommentsControllerTest < ActionController::TestCase
  setup do
    @comment = comments(:one)
    post = posts(:one)
    post.user_id = users(:one).id
    post.save
    @comment.update(:post_id => post.id)
    @comment = Comment.find @comment.id
    session[:user_id] = users(:one).id
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:comments)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create comment" do
    @comment.email = "livoras@163.com"
    @comment.name = "Lucy"
    @comment.content = "Lucy@you"
    assert_difference('Comment.count') do
      post :create, content: @comment.content, email: @comment.email, name: @comment.name, post_id: posts(:one)
    end
  end

  test "should show comment" do
    get :show, id: @comment
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @comment
    assert_response :success
  end

  test "should destroy comment" do
    assert_difference('Comment.count', -1) do
      delete :destroy, id: @comment.id
    end

    assert_redirected_to edit_post_path(@comment.post) + "#comments"
  end
end
